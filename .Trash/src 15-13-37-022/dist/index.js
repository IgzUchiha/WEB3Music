// src/actions/post.ts
import {
    composeContext,
    elizaLogger,
    ModelClass,
    generateObject,
    truncateToCompleteSentence
  } from "@elizaos/core";
  import { InstagramScraper } from "agent-instagram-client";
  import { instagramPostTemplate } from "../templates";
  import { isInstagramContent, InstagramSchema } from "../types";
  
  export const DEFAULT_MAX_POST_LENGTH = 2200;
  export const DEFAULT_MAX_HASHTAGS = 30;
  
  async function composeInstagramPost(
    runtime: IAgentRuntime,
    _message: Memory,
    state?: State
  ): Promise<string> {
    try {
      const context = composeContext({
        state,
        template: instagramPostTemplate,
      });
  
      const postContentObject = await generateObject({
        runtime,
        context,
        modelClass: ModelClass.SMALL,
        schema: InstagramSchema,
        stop: ["\n"]
      });
  
      if (!isInstagramContent(postContentObject.object)) {
        elizaLogger.error(
          "Invalid Instagram post content:",
          postContentObject.object
        );
        return;
      }
  
      let content = postContentObject.object.caption.trim();
      
      // Handle hashtags
      const hashtags = postContentObject.object.hashtags
        ?.slice(0, DEFAULT_MAX_HASHTAGS)
        .join(" ");
      if (hashtags) content += `\n\n${hashtags}`;
  
      // Truncate to max length
      const maxPostLength = runtime.getSetting("MAX_POST_LENGTH") || DEFAULT_MAX_POST_LENGTH;
      return truncateToCompleteSentence(content, Number(maxPostLength));
    } catch (error) {
      elizaLogger.error("Error composing Instagram post:", error);
      throw error;
    }
  }
  
  async function sendInstagramPost(instagramClient: InstagramScraper, content: string) {
    const result = await instagramClient.createPost({
      caption: content,
      // Media handling would need additional implementation
    });
  
    const body = await result.json();
    elizaLogger.log("Instagram response:", body);
  
    if (body.error) {
      elizaLogger.error(
        `Instagram API error (${body.code}): ${body.message}`
      );
      return false;
    }
  
    if (!body?.data?.create_post?.id) {
      elizaLogger.error("Failed to create post: No post ID in response");
      return false;
    }
  
    return true;
  }
  
  async function postToInstagram(
    runtime: IAgentRuntime,
    content: string
  ): Promise<boolean> {
    try {
      const instagramClient = runtime.clients.instagram?.client?.instagramClient;
      const scraper = instagramClient || new InstagramScraper();
  
      if (!instagramClient) {
        const username = runtime.getSetting("INSTAGRAM_USERNAME");
        const password = runtime.getSetting("INSTAGRAM_PASSWORD");
  
        if (!username || !password) {
          elizaLogger.error(
            "Instagram credentials not configured in environment"
          );
          return false;
        }
  
        await scraper.login(username, password);
        if (!(await scraper.isLoggedIn())) {
          elizaLogger.error("Failed to login to Instagram");
          return false;
        }
      }
  
      elizaLogger.log("Attempting to create Instagram post:", content);
  
      if (process.env.INSTAGRAM_DRY_RUN?.toLowerCase() === "true") {
        elizaLogger.info(
          `Dry run: would have posted to Instagram: ${content}`
        );
        return true;
      }
  
      return await sendInstagramPost(scraper, content);
    } catch (error) {
      elizaLogger.error("Error posting to Instagram:", {
        message: error.message,
        stack: error.stack,
      });
      return false;
    }
  }
  
  export const postAction: Action = {
    name: "POST_INSTAGRAM",
    similes: ["POST", "SHARE", "CREATE_POST", "UPLOAD"],
    description: "Create a new Instagram post",
    validate: async (
      runtime: IAgentRuntime,
      _message: Memory,
      _state?: State
    ) => {
      const username = runtime.getSetting("INSTAGRAM_USERNAME");
      const password = runtime.getSetting("INSTAGRAM_PASSWORD");
      return !!username && !!password;
    },
    handler: async (
      runtime: IAgentRuntime,
      message: Memory,
      state?: State
    ): Promise<boolean> => {
      try {
        const postContent = await composeInstagramPost(runtime, message, state);
        if (!postContent) {
          elizaLogger.error("No content generated for Instagram post");
          return false;
        }
  
        elizaLogger.log(`Generated Instagram content: ${postContent}`);
        return await postToInstagram(runtime, postContent);
      } catch (error) {
        elizaLogger.error("Error in Instagram post action:", error);
        return false;
      }
    },
    examples: [
      [
        {
          user: "{{user1}}",
          content: { text: "You should post that on IG" },
        },
        {
          user: "{{agentName}}",
          content: {
            text: "I'll share this on Instagram right away!",
            action: "POST_INSTAGRAM",
          },
        },
      ],
      [
        {
          user: "{{user1}}",
          content: { text: "Create an Instagram post about this" },
        },
        {
          user: "{{agentName}}",
          content: {
            text: "I'll craft an Instagram post for this content.",
            action: "POST_INSTAGRAM",
          },
        },
      ],
      [
        {
          user: "{{user1}}",
          content: { text: "Share that on the gram" },
        },
        {
          user: "{{agentName}}",
          content: {
            text: "I'll put this up on the gram shortly.",
            action: "POST_INSTAGRAM",
          },
        },
      ],
      [
        {
          user: "{{user1}}",
          content: { text: "Post that to Insta" },
        },
        {
          user: "{{agentName}}",
          content: {
            text: "I'll get this posted to Insta now.",
            action: "POST_INSTAGRAM",
          },
        },
      ],
      [
        {
          user: "{{user1}}",
          content: { text: "You should put this on IG stories" },
        },
        {
          user: "{{agentName}}",
          content: {
            text: "I'll add this to my Instagram Stories.",
            action: "POST_INSTAGRAM",
          },
        },
      ],
    ],
  };
  
  // src/templates.ts
  var instagramPostTemplate = `
  # Context
  {{recentMessages}}
  
  # Topics
  {{topics}}
  
  # Post Directions
  {{postDirections}}
  
  # Recent interactions between {{agentName}} and other users:
  {{recentPostInteractions}}
  
  # Task
  Generate an Instagram post that:
  1. Relates to the recent conversation or requested topic
  2. Matches the character's style and voice
  3. Includes relevant hashtags (max 30)
  4. Has a compelling caption under 2200 characters
  5. Speaks from the perspective of {{agentName}}
  
  Structure:
  - Main caption text
  - Line break
  - Hashtags (comma-separated)
  
  Generate only the post content in JSON format like: 
  {"caption": "your caption here", "hashtags": ["hashtag1", "hashtag2"]}`;
  
  // src/types.ts
  var InstagramSchema = z.object({
    caption: z.string().describe("The main caption text"),
    hashtags: z.array(z.string().startsWith("#")).optional().describe("Array of relevant hashtags")
  });
  
  var isInstagramContent = (obj) => {
    return InstagramSchema.safeParse(obj).success;
  };