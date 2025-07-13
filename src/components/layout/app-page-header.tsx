import { LoginLogoutButton } from "@/src/components/common/login-logout-button";
import { SettingsButton } from "@/src/components/common/settings-button";
import { ThemeToggle } from "@/src/components/common/theme-toggle";
import { auth } from "@/src/server/auth";

export async function AppPageHeader() {
	const session = await auth();
	const isLoggedIn = !!session?.user;

	return (
		<div className="absolute top-4 right-4 z-50 flex items-center gap-2">
			<ThemeToggle />
			{isLoggedIn && <SettingsButton />}
			{process.env.AUTH_PASSWORD && (
				<LoginLogoutButton isLoggedIn={isLoggedIn} />
			)}
		</div>
	);
}
