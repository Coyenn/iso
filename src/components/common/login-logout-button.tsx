"use client";

import { KeyRound, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { signIn, signOut } from "next-auth/react";
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
					onClick={() => {
						if (isLoggedIn) {
							signOut();
						} else {
							signIn();
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
								key="light"
							>
								<LogOut />
							</motion.div>
						) : (
							<motion.div
								initial={{ scale: 0.75, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.75, opacity: 0 }}
								transition={{ duration: 0.15, ease: "easeInOut" }}
								key="dark"
							>
								<KeyRound />
							</motion.div>
						)}
					</AnimatePresence>
				</Button>
			</TooltipTrigger>
			<TooltipContent>{isLoggedIn ? "Logout" : "Login"}</TooltipContent>
		</Tooltip>
	);
}
