import { z } from "zod";
import { env } from "@/src/env";

export const stylesheetsLocation = `${env.APP_DATA_PATH}/css`;
export const customStylesheetLocation = `${env.APP_DATA_PATH}/css/custom.css`;

export const stylesheetSchema = z.object({
	customStylesheet: z.string().min(1).max(10000),
});
