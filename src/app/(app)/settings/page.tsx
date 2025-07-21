import { redirect } from "next/navigation";
import { SettingsForm } from "@/src/components/forms/settings-form";
import { getCustomStylesheet } from "@/src/server/actions/stylesheet/get-custom-stylesheet";
import { auth } from "@/src/server/auth";
import { getConfig } from "@/src/server/get-config";

export default async function SettingsPage() {
	const session = await auth();

	if (!session) {
		redirect("/");
	}

	const config = await getConfig();
	const customStylesheet = await getCustomStylesheet();

	return (
		<div className="mt-12 mb-8 h-full w-full max-w-[750px] self-center p-4">
			<SettingsForm
				currentConfig={config}
				customStylesheet={customStylesheet}
			/>
		</div>
	);
}
