import z from "zod";

export const greetingSchema = z.object({
	message: z.string().min(1, { message: "Greeting message cannot be empty" }),
});

export type Greeting = z.infer<typeof greetingSchema>;
