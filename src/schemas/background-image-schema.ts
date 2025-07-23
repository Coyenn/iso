import { z } from "zod";

const blurLevels = [
	"none",
	"xs",
	"sm",
	"md",
	"lg",
	"xl",
	"2xl",
	"3xl",
] as const;

export type BlurLevel = (typeof blurLevels)[number];

export const backgroundImageSchema = z.object({
	light: z.string().optional(),
	dark: z.string().optional(),
	opacity: z.number().min(0).max(100).default(50),
	blur: z.enum(blurLevels).default("xs"),
});

export const backgroundImageFormSchema = z.object({
	light: z.union([z.string(), z.instanceof(File)]).optional(),
	dark: z.union([z.string(), z.instanceof(File)]).optional(),
	opacity: z.number().min(0).max(100).default(50),
	blur: z.enum(blurLevels).default("xs"),
});
