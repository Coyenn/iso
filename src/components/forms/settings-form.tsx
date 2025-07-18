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
import HighlightedTextarea from "@/src/components/common/highlighted-textarea";
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
import { Switch } from "@/src/components/ui/switch";
import { locales } from "@/src/config/locale";
import { stylesheetSchema } from "@/src/config/stylesheet";
import { cn } from "@/src/lib/utils";
import { type Config, configSchema } from "@/src/schemas/config-schema";
import { themeSchema } from "@/src/schemas/theme-schema";
import { updateConfig } from "@/src/server/actions/config/update-config";
import { updateCustomStylesheet } from "@/src/server/actions/stylesheet/update-custom-stylesheet";

export interface SettingsFormProps {
	currentConfig: Config;
	customStylesheet: string;
}

const configSchemaWithStylesheet = configSchema.extend(stylesheetSchema.shape);

export function SettingsForm(props: SettingsFormProps) {
	const { currentConfig, customStylesheet } = props;
	const { refresh } = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [greetingsParent] = useAutoAnimate<HTMLDivElement>();
	const form = useForm({
		resolver: zodResolver(configSchemaWithStylesheet),
		defaultValues: { ...currentConfig, customStylesheet },
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

			const configResult = await updateConfig(values);
			const stylesheetResult = await updateCustomStylesheet(values);

			if (stylesheetResult.success && configResult.success) {
				toast.success(t("success"));
			} else {
				toast.error(stylesheetResult.error || configResult.error || t("error"));
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
			<Card className="w-full border-none bg-transparent">
				<CardHeader>
					<CardTitle>{t("title")}</CardTitle>
				</CardHeader>
				<CardContent className="px-6">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<div className="grid gap-6">
								{/* Theme */}
								<FormField
									control={form.control}
									name="theme"
									render={({ field }) => (
										<FormItem className="grid gap-2">
											<FormLabel htmlFor="theme">{t("theme.title")}</FormLabel>
											<p className="text-muted-foreground text-sm">
												{t("theme.description")}
											</p>
											<div className="py-4">
												<FormControl>
													<div className="grid grid-cols-3 gap-4 md:grid-cols-5">
														{themeSchema.options.map((theme) => (
															<div
																key={theme}
																className={cn(
																	"flex flex-col items-center gap-1",
																	`theme-${theme}`,
																)}
															>
																<button
																	type="button"
																	onClick={() => {
																		// Change the theme "live" in the body
																		themeSchema.options.forEach((t) => {
																			document.body.classList.remove(
																				`theme-${t}`,
																			);
																		});
																		document.body.classList.add(
																			`theme-${theme}`,
																		);

																		field.onChange(theme);
																	}}
																	className={cn(
																		"flex flex-col items-center gap-1 rounded-md border border-input p-2 transition-colors hover:bg-accent/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:bg-input/30 dark:hover:bg-accent/50",
																		field.value === theme && "border-primary",
																	)}
																	aria-label={theme}
																	aria-pressed={field.value === theme}
																>
																	<Image
																		src={`/theme-icons/${theme}.png`}
																		alt={`${theme} theme icon`}
																		className="aspect-square h-full w-full"
																		width={256}
																		height={256}
																	/>
																</button>
																<span className="text-sm capitalize">
																	{theme}
																</span>
															</div>
														))}
													</div>
												</FormControl>
											</div>
											<FormMessage className="text-center" />
										</FormItem>
									)}
								/>

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
											variant="outline"
											className="w-full"
											onClick={() => appendGreeting({ message: "" })}
										>
											{t("greetings.addGreeting")}
										</Button>
									</div>
								</div>

								{/* Custom Stylesheet */}
								<div className="grid gap-2">
									<p className="font-medium text-sm">
										{t("customStylesheet.title")}
									</p>
									<p className="text-muted-foreground text-sm">
										{t("customStylesheet.description")}
									</p>
									<FormControl>
										<HighlightedTextarea
											value={form.watch("customStylesheet")}
											onChange={(val) => form.setValue("customStylesheet", val)}
										/>
									</FormControl>
									<FormMessage className="text-center" />
								</div>

								{/* Page Load Animation */}
								<FormField
									control={form.control}
									name="pageLoadAnimation"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between gap-2">
											<div className="grid gap-2">
												<FormLabel htmlFor="pageLoadAnimation">
													{t("pageLoadAnimation.title")}
												</FormLabel>
												<p className="text-muted-foreground text-sm">
													{t("pageLoadAnimation.description")}
												</p>
											</div>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
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
