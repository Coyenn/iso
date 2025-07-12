import { MainSection } from "@/src/components/main-section";
import { getConfig } from "@/src/server/get-config";

export default async function Home() {
	const config = await getConfig();

	return <MainSection config={config} />;
}
