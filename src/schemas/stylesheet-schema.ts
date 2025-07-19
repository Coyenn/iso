import { z } from "zod";

export const stylesheetSchema = z.object({
	customStylesheet: z.string().min(0).max(10000),
});
