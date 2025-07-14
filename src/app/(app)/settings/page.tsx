import { redirect } from "next/navigation";
import { SettingsForm } from "@/src/components/forms/settings-form";
import { auth } from "@/src/server/auth";
import { getConfig } from "@/src/server/get-config";

export default async function SettingsPage() {
	const session = await auth();
	const config = await getConfig();

	if (!session) {
		redirect("/");
	}

	return (
		<div className="mt-12 h-full w-full max-w-[700px] self-center p-4">
			<SettingsForm currentConfig={config} />
		</div>
	);
}
