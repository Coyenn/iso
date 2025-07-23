import { z } from "zod";

export const backgroundImageSchema = z.object({
	light: z.string().optional(),
	dark: z.string().optional(),
});

export const backgroundImageFormSchema = z.object({
	light: z.union([z.string(), z.instanceof(File)]).optional(),
	dark: z.union([z.string(), z.instanceof(File)]).optional(),
});
