import type { Plugin } from "@elizaos/core";
import { postAction } from "./actions/post";

export const instagramPlugin: Plugin = {
    name: "instagram",
    description: "Instagram integration plugin for posting",
    actions: [postAction],
    evaluators: [],
    providers: [],
};

export default instagramPlugin;
