import { z } from "zod";

export interface InstagramContent {
    text: string;
}

export const InstagramSchema = z.object({
    text: z.string().describe("The text of the Caption"),
});

export const isInstagramContent = (obj: unknown): obj is InstagramContent => {
    return InstagramSchema.safeParse(obj).success;
};
