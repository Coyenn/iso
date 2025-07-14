"use client";

import { KeyRound, LogOut } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
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
			<TooltipContent>{isLoggedIn ? "Logout" : "Login"}</TooltipContent>
		</Tooltip>
	);
}
