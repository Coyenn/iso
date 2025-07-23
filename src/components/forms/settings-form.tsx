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
import { FileInput } from "@/src/components/ui/file-input";
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
import { Slider } from "@/src/components/ui/slider";
import { Switch } from "@/src/components/ui/switch";
import { locales } from "@/src/config/locale";
import { cn } from "@/src/lib/utils";
import { backgroundImageFormSchema } from "@/src/schemas/background-image-schema";
import { type Config, configSchema } from "@/src/schemas/config-schema";
import { searchEngineSchema } from "@/src/schemas/search-engine-schema";
import { stylesheetSchema } from "@/src/schemas/stylesheet-schema";
import { themeSchema } from "@/src/schemas/theme-schema";
import { uploadBackgroundImages } from "@/src/server/actions/background/upload-background-images";
import { updateConfig } from "@/src/server/actions/config/update-config";
import { updateCustomStylesheet } from "@/src/server/actions/stylesheet/update-custom-stylesheet";

export interface SettingsFormProps {
	currentConfig: Config;
	customStylesheet: string;
}

const configSchemaWithStylesheet = configSchema
	.omit({ backgroundImage: true })
	.extend(stylesheetSchema.shape)
	.extend({
		backgroundImage: backgroundImageFormSchema,
	});

export function SettingsForm(props: SettingsFormProps) {
	const { currentConfig, customStylesheet } = props;
	const { refresh } = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [greetingsParent] = useAutoAnimate<HTMLDivElement>();
	const form = useForm({
		resolver: zodResolver(configSchemaWithStylesheet),
		defaultValues: { ...currentConfig, customStylesheet },
		mode: "onSubmit",
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

	async function onSubmit(values: z.infer<typeof configSchemaWithStylesheet>) {
		try {
			if (isLoading) return;

			setIsLoading(true);
			setError(null);

			const backgroundImagesResult = await uploadBackgroundImages(
				values.backgroundImage,
			);

			if (!backgroundImagesResult.success) {
				toast.error(backgroundImagesResult.error || t("error"));
				return;
			}

			const uploadedImages = backgroundImagesResult.images ?? {
				light: "",
				dark: "",
			};

			const backgroundImageData = {
				light:
					uploadedImages.light !== ""
						? uploadedImages.light
						: typeof values.backgroundImage.light === "string"
							? values.backgroundImage.light
							: "",
				dark:
					uploadedImages.dark !== ""
						? uploadedImages.dark
						: typeof values.backgroundImage.dark === "string"
							? values.backgroundImage.dark
							: "",
				opacity: values.backgroundImage.opacity,
				blur: values.backgroundImage.blur,
			};

			const configData: Config = {
				...values,
				backgroundImage: backgroundImageData as Config["backgroundImage"],
			};

			const configResult = await updateConfig(configData);
			const stylesheetResult = await updateCustomStylesheet(values);

			if (!stylesheetResult.success || !configResult.success) {
				toast.error(stylesheetResult.error || configResult.error || t("error"));
			} else {
				toast.success(t("success"));
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
			<Card className="w-full border-none bg-transparent p-0">
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
										<FormItem className="grid gap-2 rounded-md border border-input bg-background p-4 shadow-xs">
											<FormLabel htmlFor="theme">{t("theme.title")}</FormLabel>
											<p className="text-muted-foreground text-sm">
												{t("theme.description")}
											</p>
											<hr className="my-2 border-input" />
											<div>
												<FormControl>
													<div className="grid grid-cols-3 gap-4 md:grid-cols-6 md:gap-2">
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
																		field.onChange(theme);
																	}}
																	className={cn(
																		"flex w-full flex-col items-center gap-1 rounded-md border border-input p-2 transition-colors hover:bg-accent/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:bg-input/30 dark:hover:bg-accent/50",
																		field.value === theme && "border-primary",
																	)}
																	aria-label={theme}
																	aria-pressed={field.value === theme}
																>
																	<Image
																		src={`/icons/${theme}.png`}
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
										<FormItem className="grid gap-2 rounded-md border border-input bg-background p-4 shadow-xs">
											<FormLabel htmlFor="title">
												{t("pageTitle.title")}
											</FormLabel>
											<p className="text-muted-foreground text-sm">
												{t("pageTitle.description")}
											</p>
											<hr className="my-2 border-input" />
											<div>
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
										<FormItem className="grid gap-2 rounded-md border border-input bg-background p-4 shadow-xs">
											<FormLabel htmlFor="locale">
												{t("locale.title")}
											</FormLabel>
											<p className="text-muted-foreground text-sm">
												{t("locale.description")}
											</p>
											<hr className="my-2 border-input" />
											<div>
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
								<div className="grid gap-2 rounded-md border border-input bg-background p-4 shadow-xs">
									<p className="font-medium text-sm">{t("greetings.title")}</p>
									<p className="text-muted-foreground text-sm">
										{t("greetings.description")}
									</p>
									<hr className="my-2 border-input" />
									<div className="space-y-4" ref={greetingsParent}>
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
								<div className="grid gap-2 rounded-md border border-input bg-background p-4 shadow-xs">
									<p className="font-medium text-sm">
										{t("customStylesheet.title")}
									</p>
									<p className="text-muted-foreground text-sm">
										{t("customStylesheet.description")}
									</p>
									<hr className="my-2 border-input" />
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
										<FormItem className="flex flex-row items-center justify-between gap-2 rounded-md border border-input bg-background p-4 shadow-xs">
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

								{/* Enable Searchbar */}
								<FormField
									control={form.control}
									name="search.enabled"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between gap-2 rounded-md border border-input bg-background p-4 shadow-xs">
											<div className="grid gap-2">
												<FormLabel htmlFor="searchEnabled">
													{t("showSearchbar.title")}
												</FormLabel>
												<p className="text-muted-foreground text-sm">
													{t("showSearchbar.description")}
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

								{/* Search Engine */}
								{form.watch("search.enabled") && (
									<FormField
										control={form.control}
										name="search.engine"
										render={({ field }) => (
											<FormItem className="grid gap-2 rounded-md border border-input bg-background p-4 shadow-xs">
												<FormLabel htmlFor="searchEngine">
													{t("searchEngine.title")}
												</FormLabel>
												<p className="text-muted-foreground text-sm">
													{t("searchEngine.description")}
												</p>
												<hr className="my-2 border-input" />
												<div>
													<FormControl>
														<div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
															{searchEngineSchema.options.map((engine) => (
																<div
																	key={engine}
																	className="flex flex-col items-center gap-2"
																>
																	<button
																		type="button"
																		onClick={() => {
																			field.onChange(engine);
																		}}
																		className={cn(
																			"flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-md border border-input p-3 transition-colors hover:bg-accent/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:bg-input/30 dark:hover:bg-accent/50",
																			field.value === engine &&
																				"border-primary bg-primary/5",
																		)}
																		aria-label={`Select ${engine} search engine`}
																		aria-pressed={field.value === engine}
																	>
																		<Image
																			src={`/icons/search-engines/${engine}.svg`}
																			alt={`${engine} search engine`}
																			className="h-8 w-8"
																			width={32}
																			height={32}
																		/>
																	</button>
																	<span className="text-center text-xs capitalize">
																		{engine}
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
								)}

								{/* Custom Search Engine URL */}
								{form.watch("search.engine") === "custom" && (
									<FormField
										control={form.control}
										name="search.engineUrl"
										render={({ field }) => (
											<FormItem className="grid gap-2 rounded-md border border-input bg-background p-4 shadow-xs">
												<FormLabel htmlFor="searchEngineUrl">
													{t("searchEngineUrl.title")}
												</FormLabel>
												<p className="text-muted-foreground text-sm">
													{t("searchEngineUrl.description")}
												</p>
												<hr className="my-2 border-input" />
												<FormControl>
													<Input
														id="searchEngineUrl"
														placeholder="https://example.com/search"
														{...field}
													/>
												</FormControl>
												<FormMessage className="text-center" />
											</FormItem>
										)}
									/>
								)}

								{/* Custom Search Placeholder */}
								{form.watch("search.enabled") && (
									<FormField
										control={form.control}
										name="search.placeholder"
										render={({ field }) => (
											<FormItem className="grid gap-2 rounded-md border border-input bg-background p-4 shadow-xs">
												<FormLabel htmlFor="searchPlaceholder">
													{t("searchPlaceholder.title")}
												</FormLabel>
												<p className="text-muted-foreground text-sm">
													{t("searchPlaceholder.description")}
												</p>
												<hr className="my-2 border-input" />
												<FormControl>
													<Input
														id="searchPlaceholder"
														placeholder={t("searchPlaceholder.placeholder")}
														{...field}
													/>
												</FormControl>
												<FormMessage className="text-center" />
											</FormItem>
										)}
									/>
								)}

								{/* Background Images */}
								<div className="grid gap-2">
									<div className="space-y-4">
										{/* Light Mode Background */}
										<FormField
											control={form.control}
											name="backgroundImage.light"
											render={({ field }) => (
												<FormItem className="grid gap-2 rounded-md border border-input bg-background p-4 shadow-xs">
													<FormLabel htmlFor="backgroundImageLight">
														{t("backgroundImage.light.title")}
													</FormLabel>
													<p className="text-muted-foreground text-sm">
														{t("backgroundImage.light.description")}
													</p>
													<hr className="my-2 border-input" />
													<FormControl>
														<FileInput
															id="backgroundImageLight"
															accept="image/*"
															onChange={(e) => {
																const file = e.target.files?.[0];
																if (file) {
																	field.onChange(file);
																}
															}}
															buttonLabel={
																field.value
																	? t("backgroundImage.changeImage")
																	: t("backgroundImage.selectImage")
															}
														/>
													</FormControl>
													{field.value &&
														typeof field.value === "string" &&
														field.value.startsWith("/images/") && (
															<div className="relative">
																<Image
																	src={field.value}
																	alt="Light mode background preview"
																	className="h-24 w-full rounded-md object-cover"
																	width={200}
																	height={96}
																/>
																<Button
																	type="button"
																	variant="outline"
																	size="sm"
																	className="absolute top-2 right-2"
																	onClick={() => field.onChange("")}
																>
																	<X className="h-3 w-3" />
																</Button>
															</div>
														)}
													<FormMessage className="text-center" />
												</FormItem>
											)}
										/>

										{/* Dark Mode Background */}
										<FormField
											control={form.control}
											name="backgroundImage.dark"
											render={({ field }) => (
												<FormItem className="grid gap-2 rounded-md border border-input bg-background p-4 shadow-xs">
													<FormLabel htmlFor="backgroundImageDark">
														{t("backgroundImage.dark.title")}
													</FormLabel>
													<p className="text-muted-foreground text-sm">
														{t("backgroundImage.dark.description")}
													</p>
													<hr className="my-2 border-input" />
													<FormControl>
														<FileInput
															id="backgroundImageDark"
															accept="image/*"
															onChange={(e) => {
																const file = e.target.files?.[0];
																if (file) {
																	field.onChange(file);
																}
															}}
															buttonLabel={
																field.value
																	? t("backgroundImage.changeImage")
																	: t("backgroundImage.selectImage")
															}
														/>
													</FormControl>
													{field.value &&
														typeof field.value === "string" &&
														field.value.startsWith("/images/") && (
															<div className="relative">
																<Image
																	src={field.value}
																	alt="Dark mode background preview"
																	className="h-24 w-full rounded-md object-cover"
																	width={200}
																	height={96}
																/>
																<Button
																	type="button"
																	variant="outline"
																	size="sm"
																	className="absolute top-2 right-2"
																	onClick={() => field.onChange("")}
																>
																	<X className="h-3 w-3" />
																</Button>
															</div>
														)}
													<FormMessage className="text-center" />
												</FormItem>
											)}
										/>

										{/* Background Opacity Slider */}
										<FormField
											control={form.control}
											name="backgroundImage.opacity"
											render={({ field }) => (
												<FormItem className="grid gap-2 rounded-md border border-input bg-background p-4 shadow-xs">
													<FormLabel htmlFor="backgroundImageOpacity">
														{t("backgroundImage.opacity.title") ||
															"Background Opacity"}
													</FormLabel>
													<p className="text-muted-foreground text-sm">
														{t("backgroundImage.opacity.description") ||
															"Adjust the transparency of the background image."}
													</p>
													<hr className="my-2 border-input" />
													<FormControl>
														<div className="flex items-center gap-2">
															<Slider
																id="backgroundImageOpacity"
																min={0}
																max={100}
																step={5}
																defaultValue={[field.value ?? 50]}
																onValueChange={(value) =>
																	field.onChange(Number(value))
																}
																className="flex-1"
															/>
															<span className="w-10 text-right text-sm">
																{field.value ?? 50}%
															</span>
														</div>
													</FormControl>
													<FormMessage className="text-center" />
												</FormItem>
											)}
										/>

										{/* Background Blur Dropdown */}
										<FormField
											control={form.control}
											name="backgroundImage.blur"
											render={({ field }) => (
												<FormItem className="grid gap-2 rounded-md border border-input bg-background p-4 shadow-xs">
													<FormLabel htmlFor="backgroundImageBlur">
														{t("backgroundImage.blur.title") ||
															"Background Blur"}
													</FormLabel>
													<p className="text-muted-foreground text-sm">
														{t("backgroundImage.blur.description") ||
															"Select the blur intensity applied to the background image."}
													</p>
													<hr className="my-2 border-input" />
													<FormControl>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value ?? "xs"}
														>
															<SelectTrigger className="w-full">
																<SelectValue placeholder="Select blur" />
															</SelectTrigger>
															<SelectContent>
																{[
																	"none",
																	"xs",
																	"sm",
																	"md",
																	"lg",
																	"xl",
																	"2xl",
																	"3xl",
																].map((b) => (
																	<SelectItem key={b} value={b}>
																		{b}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													</FormControl>
													<FormMessage className="text-center" />
												</FormItem>
											)}
										/>
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
