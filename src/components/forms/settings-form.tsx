"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/src/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/src/components/ui/select";
import { type Config, configSchema } from "@/src/config/config";
import { locales } from "@/src/config/locale";
import { updateConfig } from "@/src/server/actions/config/update-config";

export interface SettingsFormProps {
	currentConfig: Config;
}

export function SettingsForm(props: SettingsFormProps) {
	const { currentConfig } = props;
	const { refresh } = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [greetingsParent] = useAutoAnimate<HTMLDivElement>();
	const form = useForm({
		resolver: zodResolver(configSchema),
		defaultValues: currentConfig,
	});
	const t = useTranslations("settings");

	const {
		fields: greetingFields,
		append: appendGreeting,
		remove: removeGreeting,
	} = useFieldArray({
		control: form.control,
		name: "greetings",
	});

	async function onSubmit(values: z.infer<typeof configSchema>) {
		try {
			if (isLoading) return;

			setIsLoading(true);
			setError(null);

			const result = await updateConfig(values);
			if (result.success) {
				toast.success(t("success"));
			} else {
				toast.error(result.error);
			}
		} catch (e) {
			console.error(e);
			toast.error(t("error"));
		} finally {
			refresh();
			setTimeout(() => {
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
			<Card className="w-full border-none">
				<CardHeader>
					<CardTitle className="text-center">{t("title")}</CardTitle>
				</CardHeader>
				<CardContent className="px-6">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<div className="grid gap-6">
								{/* Title */}
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem className="grid gap-2">
											<FormLabel htmlFor="title">
												{t("pageTitle.title")}
											</FormLabel>
											<p className="text-muted-foreground text-sm">
												{t("pageTitle.description")}
											</p>
											<div className="rounded-md border border-input bg-background p-4 shadow-xs">
												<div className="mb-4 flex w-max items-center gap-2 rounded-t-xl bg-input/30 p-2">
													<Image
														src="/favicon.ico"
														alt="Iso Dashboard"
														width={16}
														height={16}
													/>
													<p className="max-w-[150px] truncate text-sm">
														{field.value}
													</p>
													<X className="h-4 w-4 cursor-pointer" />
												</div>
												<FormControl>
													<Input
														id="title"
														placeholder="Iso Dashboard"
														{...field}
													/>
												</FormControl>
											</div>
											<FormMessage className="text-center" />
										</FormItem>
									)}
								/>

								{/* Locale */}
								<FormField
									control={form.control}
									name="locale"
									render={({ field }) => (
										<FormItem className="grid gap-2">
											<FormLabel htmlFor="locale">
												{t("locale.title")}
											</FormLabel>
											<p className="text-muted-foreground text-sm">
												{t("locale.description")}
											</p>
											<div className="rounded-md border border-input bg-background p-4 shadow-xs">
												<p className="mb-4 font-instrument-serif text-xl sm:text-2xl md:text-3xl">
													{
														locales.find((l) => l.code === field.value)
															?.greetings[0]?.message
													}
												</p>
												<FormControl>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Select locale" />
														</SelectTrigger>
														<SelectContent>
															{locales.map((l) => (
																<SelectItem key={l.code} value={l.code}>
																	{l.name}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</FormControl>
											</div>
											<FormMessage className="text-center" />
										</FormItem>
									)}
								/>

								{/* Greetings */}
								<div className="grid gap-2">
									<p className="font-medium text-sm">{t("greetings.title")}</p>
									<p className="text-muted-foreground text-sm">
										{t("greetings.description")}
									</p>
									<div
										className="space-y-4 rounded-md border border-input bg-background p-4 shadow-xs"
										ref={greetingsParent}
									>
										{greetingFields.map((greeting, index) => (
											<div
												key={greeting.id}
												className="grid grid-cols-[1fr_auto] items-end gap-2"
											>
												<FormField
													control={form.control}
													name={`greetings.${index}`}
													render={({ field }) => (
														<FormItem className="grid gap-1">
															<FormControl>
																<Input
																	id={`greeting-${index}`}
																	placeholder="Welcome!"
																	value={field.value?.message || ""}
																	onChange={(e) =>
																		field.onChange({
																			message: e.target.value,
																		})
																	}
																	onBlur={field.onBlur}
																	name={field.name}
																	ref={field.ref}
																/>
															</FormControl>
														</FormItem>
													)}
												/>
												<Button
													type="button"
													variant="destructive"
													onClick={() => removeGreeting(index)}
													aria-label={t("greetings.removeGreeting")}
												>
													<Trash2 />
												</Button>
											</div>
										))}
										<Button
											type="button"
											variant="secondary"
											className="w-full"
											onClick={() => appendGreeting({ message: "" })}
										>
											{t("greetings.addGreeting")}
										</Button>
									</div>
								</div>

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
												{t("save")}
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
