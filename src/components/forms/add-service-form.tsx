"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/src/components/ui/button";
import { FileInput } from "@/src/components/ui/file-input";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Form as ShadForm,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { icons } from "@/src/config/icons";
import { cn } from "@/src/lib/utils";
import { addServiceSchema } from "@/src/schemas/add-service-schema";
import { addService } from "@/src/server/actions/service/add-service";
import { useCurrentServices } from "@/src/store/current-services-context";

export interface AddServiceFormProps {
	currentServiceCount?: number;
	allUploadedIcons: [string, string][];
	onSuccess?: () => void;
}

type AddServiceSchema = z.infer<typeof addServiceSchema>;

export function AddServiceForm(props: AddServiceFormProps) {
	const { currentServiceCount, allUploadedIcons, onSuccess } = props;
	const t = useTranslations("forms.addService");
	const { refresh } = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [iconsParent] = useAutoAnimate<HTMLDivElement>();
	const { currentServices, setCurrentServices } = useCurrentServices();

	const form = useForm<AddServiceSchema>({
		resolver: zodResolver(addServiceSchema),
		defaultValues: {
			icon: "",
			href: "",
			label: "",
		},
	});

	async function onSubmit(values: AddServiceSchema) {
		try {
			if (isLoading) return;

			setIsLoading(true);
			setError(null);

			const newService = {
				...values,
				order: (currentServiceCount ?? 0) + 1,
			};

			const result = await addService(newService);

			if (result.success) {
				form.reset();

				if (result.data) {
					setCurrentServices([...currentServices, result.data]);
				}

				onSuccess?.();
			} else {
				toast.error(result.error || t("error"));
			}
		} catch (e) {
			console.error(e);
			toast.error(t("error"));
		} finally {
			refresh();
			setTimeout(() => setIsLoading(false), 500);
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			transition={{ duration: 0.1 }}
		>
			<ShadForm {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<div className="grid gap-6">
						{/* Icon */}
						<FormField
							control={form.control}
							name="icon"
							render={({ field }) => (
								<FormItem className="grid gap-2">
									<FormLabel>{t("iconLabel")}</FormLabel>
									<p className="text-muted-foreground text-sm">
										{t("iconDescription")}
									</p>
									{/* Existing icons */}
									<div
										className="grid max-h-[300px] grid-cols-3 gap-2 overflow-y-auto md:grid-cols-4"
										ref={iconsParent}
									>
										{[...allUploadedIcons, ...Object.entries(icons)].map(
											([key, src]) => (
												<Button
													variant="ghost"
													key={key}
													onClick={(e) => {
														e.preventDefault();
														field.onChange(key);
													}}
													aria-label={`Select ${key} icon`}
													className={cn(
														"aspect-square h-full w-full p-1 hover:bg-accent focus-visible:bg-accent",
														field.value === key && "!bg-accent",
													)}
												>
													<Image src={src} alt={key} width={120} height={120} />
												</Button>
											),
										)}
									</div>
									{/* Upload new icon */}
									<div className="mt-4">
										<FormControl>
											<FileInput
												accept="image/*"
												onChange={(e) => {
													const file = e.target.files?.[0];
													if (!file) return;
													field.onChange(file);
												}}
												ref={field.ref}
											/>
										</FormControl>
									</div>
								</FormItem>
							)}
						/>

						{/* Label */}
						<FormField
							control={form.control}
							name="label"
							render={({ field }) => (
								<FormItem className="grid gap-2">
									<FormLabel htmlFor="label">{t("nameLabel")}</FormLabel>
									<FormControl>
										<Input
											id="label"
											placeholder={t("serviceNamePlaceholder")}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Href */}
						<FormField
							control={form.control}
							name="href"
							render={({ field }) => (
								<FormItem className="grid gap-2">
									<FormLabel htmlFor="href">{t("urlLabel")}</FormLabel>
									<FormControl>
										<Input
											id="href"
											placeholder={t("urlPlaceholder")}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Submit */}
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
										key={"add"}
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
			</ShadForm>
		</motion.div>
	);
}
