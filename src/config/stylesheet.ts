import { z } from "zod";

export const stylesheetsLocation = `${process.env.APP_DATA_PATH}/css`;
export const customStylesheetLocation = `${process.env.APP_DATA_PATH}/css/custom.css`;

export const stylesheetSchema = z.object({
	customStylesheet: z.string().min(1).max(10000),
});
