"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import CompassImage from "@/public/icons/compass.png";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/src/components/ui/form";
import { PasswordInput } from "@/src/components/ui/password-input";
import { loginFormSchema } from "@/src/config/schemas";

export function LoginForm() {
	const { refresh } = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const t = useTranslations("auth.login");
	const form = useForm<z.infer<typeof loginFormSchema>>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof loginFormSchema>) {
		try {
			if (isLoading) return;

			setIsLoading(true);
			setError(null);

			const result = await signIn("credentials", {
				password: values.password,
				redirect: false,
			});

			if (result?.ok && !result?.error) {
				toast.success(t("success"));
			} else {
				setError(t("error"));
			}
		} catch (_) {
			toast.error(t("errorMessage"));
		} finally {
			setTimeout(() => {
				refresh();
				setIsLoading(false);
			}, 500);
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			transition={{ duration: 0.1 }}
		>
			<Card className="w-full">
				<CardHeader>
					<Image
						src={CompassImage}
						alt="Compass"
						width={200}
						height={200}
						className="mx-auto"
						loading="eager"
					/>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<div className="grid gap-4">
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem className="grid gap-2">
											<FormLabel htmlFor="password">{t("password")}</FormLabel>
											<FormControl>
												<PasswordInput
													id="password"
													placeholder="******"
													autoComplete="current-password"
													{...field}
												/>
											</FormControl>
											<FormMessage className="text-center" />
										</FormItem>
									)}
								/>
								<Button
									type="submit"
									className="w-full"
									disabled={isLoading}
									aria-busy={isLoading}
								>
									<AnimatePresence mode="wait" initial={false}>
										{isLoading ? (
											<motion.div
												key={"loading"}
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												transition={{ duration: 0.15 }}
											>
												<Loader2 className="h-4 w-4 animate-spin" />
											</motion.div>
										) : (
											<motion.span
												key={"login"}
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												transition={{ duration: 0.15 }}
											>
												{t("submit")}
											</motion.span>
										)}
									</AnimatePresence>
								</Button>
								<AnimatePresence>
									{error && (
										<motion.p
											initial={{ opacity: 0, y: 10, height: 0 }}
											animate={{ opacity: 1, y: 0, height: "auto" }}
											exit={{ opacity: 0, y: -10, height: 0 }}
											transition={{ duration: 0.1 }}
											className="text-center text-destructive text-sm"
										>
											{error}
										</motion.p>
									)}
								</AnimatePresence>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</motion.div>
	);
}
