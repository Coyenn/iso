"use client";

import { KeyRound, LogOut } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/src/components/ui/tooltip";

export interface LoginLogoutButtonProps {
	isLoggedIn: boolean;
}

export function LoginLogoutButton(props: LoginLogoutButtonProps) {
	const { isLoggedIn } = props;
	const t = useTranslations("tooltips");

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					onClick={async () => {
						if (isLoggedIn) {
							await signOut({
								redirect: false,
							});
							window.location.href = "/";
						} else {
							await signIn();
						}
					}}
				>
					{isLoggedIn ? (
						<div>
							<LogOut />
						</div>
					) : (
						<div>
							<KeyRound />
						</div>
					)}
				</Button>
			</TooltipTrigger>
			<TooltipContent>{isLoggedIn ? t("logout") : t("login")}</TooltipContent>
		</Tooltip>
	);
}
