import type z from "zod";
import { ServiceIconList } from "@/src/components/service-icon-list";
import type { configSchema } from "@/src/config/config";
import { locales } from "@/src/config/locale";

export interface MainSectionProps {
	config: z.infer<typeof configSchema>;
}

export function MainSection(props: MainSectionProps) {
	const { config } = props;
	const localeStrings = locales.find((locale) => locale.name === config.locale);
	const dayTime = new Date().getHours();
	const dayTimeString =
		dayTime > 5 && dayTime < 12
			? localeStrings?.dayTime.morning
			: dayTime < 18
				? localeStrings?.dayTime.afternoon
				: localeStrings?.dayTime.evening;

	return (
		<section className="container flex flex-1 flex-col items-center justify-center gap-10 py-16 sm:gap-12 md:gap-16">
			<h1 className="font-instrument-serif text-4xl sm:text-5xl md:text-6xl">
				{dayTimeString}
			</h1>
			<ServiceIconList services={config.services} />
		</section>
	);
}
