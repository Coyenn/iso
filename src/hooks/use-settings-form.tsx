import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { backgroundImageFormSchema } from "@/src/schemas/background-image-schema";
import { type Config, configSchema } from "@/src/schemas/config-schema";
import { stylesheetSchema } from "@/src/schemas/stylesheet-schema";
import { uploadBackgroundImages } from "@/src/server/actions/background/upload-background-images";
import { updateConfig } from "@/src/server/actions/config/update-config";
import { updateCustomStylesheet } from "@/src/server/actions/stylesheet/update-custom-stylesheet";

const configSchemaWithStylesheet = configSchema
	.omit({ backgroundImage: true })
	.extend(stylesheetSchema.shape)
	.extend({
		backgroundImage: backgroundImageFormSchema,
	});

export interface UseSettingsFormParams {
	currentConfig: Config;
	customStylesheet: string;
}

export function useSettingsForm(params: UseSettingsFormParams) {
	const { currentConfig, customStylesheet } = params;
	const { refresh } = useRouter();
	const t = useTranslations("settings");

	const form = useForm({
		resolver: zodResolver(configSchemaWithStylesheet),
		defaultValues: { ...currentConfig, customStylesheet },
		mode: "onSubmit",
	});

	const {
		fields: greetingFields,
		append: appendGreeting,
		remove: removeGreeting,
	} = useFieldArray({
		control: form.control,
		name: "greetings",
	});

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [unsavedToastId, setUnsavedToastId] = useState<string | number | null>(
		null,
	);

	const onSubmit = useCallback(
		async (values: z.infer<typeof configSchemaWithStylesheet>) => {
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
					toast.error(
						stylesheetResult.error || configResult.error || t("error"),
					);
				} else {
					toast.success(t("success"));
				}

				// reset form and toast
				form.reset(values);
				if (unsavedToastId) {
					toast.dismiss(unsavedToastId);
					setUnsavedToastId(null);
				}
			} catch (e) {
				console.error(e);
				toast.error(t("error"));
			} finally {
				refresh();
				setTimeout(() => setIsLoading(false), 500);
			}
		},
		[isLoading, refresh, t, form, unsavedToastId],
	);

	// show unsaved changes toast
	useEffect(() => {
		const isDirty = form.formState.isDirty;

		if (isDirty && !unsavedToastId) {
			const id = toast(t("unsavedSettings.message"), {
				action: {
					label: t("unsavedSettings.save"),
					onClick: () => form.handleSubmit(onSubmit)(),
				},
				duration: Infinity,
			});
			setUnsavedToastId(id);
		}

		if (!isDirty && unsavedToastId) {
			toast.dismiss(unsavedToastId);
			setUnsavedToastId(null);
		}
	}, [form.formState.isDirty, unsavedToastId, onSubmit, t, form]);

	return {
		form,
		t,
		isLoading,
		error,
		greetingFields,
		appendGreeting,
		removeGreeting,
		onSubmit,
	} as const;
}
