import { ServiceIcon } from "@/src/components/service-icon";
import { locales } from "@/src/config/locale";
import { getConfig } from "@/src/server/get-config";

export async function MainSection() {
	const config = await getConfig();
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
			<div className="flex flex-wrap justify-center gap-12 sm:mb-16 md:mb-20">
				{config.services.map((service) => (
					<ServiceIcon key={service.label} {...service} />
				))}
			</div>
		</section>
	);
}
