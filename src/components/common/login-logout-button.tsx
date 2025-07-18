"use client";

import { KeyRound, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { signIn, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
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
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) return null;

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
					<AnimatePresence mode="wait">
						{isLoggedIn ? (
							<motion.div
								initial={{ scale: 0.75, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.75, opacity: 0 }}
								transition={{ duration: 0.15, ease: "easeInOut" }}
								key="logout"
							>
								<LogOut />
							</motion.div>
						) : (
							<motion.div
								initial={{ scale: 0.75, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.75, opacity: 0 }}
								transition={{ duration: 0.15, ease: "easeInOut" }}
								key="login"
							>
								<KeyRound />
							</motion.div>
						)}
					</AnimatePresence>
				</Button>
			</TooltipTrigger>
			<TooltipContent>{isLoggedIn ? t("logout") : t("login")}</TooltipContent>
		</Tooltip>
	);
}
