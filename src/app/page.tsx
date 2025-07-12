import { MainSection } from "@/src/components/main-section";
import { getConfig } from "@/src/server/get-config";

export const dynamic = "force-dynamic";

export default async function Home() {
	const config = await getConfig();

	return <MainSection config={config} />;
}
