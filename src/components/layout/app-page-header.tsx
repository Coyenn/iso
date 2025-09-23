import { GithubIcon } from "lucide-react";
import Link from "next/link";
import { AddServiceButton } from "@/src/components/common/add-service-button";
import { EditModeButton } from "@/src/components/common/edit-mode-button";
import { LoginLogoutButton } from "@/src/components/common/login-logout-button";
import { SettingsButton } from "@/src/components/common/settings-button";
import { ThemeToggle } from "@/src/components/common/theme-toggle";
import { Button } from "@/src/components/ui/button";
import { env } from "@/src/env";
import { getUploadedIcons } from "@/src/server/actions/icon/get-uploaded-icons";
import { auth } from "@/src/server/auth";
import { getConfig } from "@/src/server/get-config";

export async function AppPageHeader() {
	const session = await auth();
	const isLoggedIn = !!session?.user;
	const config = await getConfig();
	const result = await getUploadedIcons(["bg-light", "bg-dark"]);

	return (
		<div className="absolute top-4 right-4 z-50 flex items-center gap-2">
			{process.env.VERCEL && (
				<Button size={"icon"} variant={"ghost"} aria-label="GitHub" asChild>
					<Link href="https://github.com/Coyenn/iso" target="_blank">
						<GithubIcon />
					</Link>
				</Button>
			)}
			{isLoggedIn && (
				<>
					<EditModeButton />
					<AddServiceButton
						serviceCount={config.services.length}
						allUploadedIcons={
							result.success && result.icons ? result.icons : []
						}
					/>
				</>
			)}
			<ThemeToggle />
			{isLoggedIn && <SettingsButton />}
			{env.AUTH_PASSWORD && <LoginLogoutButton isLoggedIn={isLoggedIn} />}
		</div>
	);
}
