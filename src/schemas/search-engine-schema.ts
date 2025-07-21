import { z } from "zod";

export const searchEngineSchema = z.enum([
	"custom",
	"google",
	"bing",
	"duckduckgo",
	"startpage",
	"qwant",
	"searx",
]);

export type SearchEngine = z.infer<typeof searchEngineSchema>;
