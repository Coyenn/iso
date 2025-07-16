import { z } from "zod";
import { serviceSchema } from "@/src/config/config";

export const addServiceSchema = serviceSchema.extend({
	icon: z.string().or(z.instanceof(File)),
});
