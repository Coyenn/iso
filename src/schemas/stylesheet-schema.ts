import { z } from "zod";

export const stylesheetSchema = z.object({
	customStylesheet: z.string().min(1).max(10000),
});
