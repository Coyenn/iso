import { z } from "zod";
import { serviceSchema } from "@/src/schemas/service-schema";

export const addServiceSchema = serviceSchema.extend({
	icon: z.string().or(z.instanceof(File)),
});
