import { getRequestConfig } from "next-intl/server";
import { getConfig } from "@/src/server/get-config";

export default getRequestConfig(async () => {
	const config = await getConfig();
	const locale = config.locale;

	return {
		locale,
		messages: (await import(`../messages/${locale}.json`)).default,
	};
});
