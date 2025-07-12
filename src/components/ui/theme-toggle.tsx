"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/src/components/ui/tooltip";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) return null;

	return (
		<div className="absolute top-4 right-4">
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => {
							if (theme === "light") setTheme("dark");
							else if (theme === "dark") setTheme("system");
							else setTheme("light");
						}}
						aria-label={`Toggle theme to ${theme === "light" ? "dark" : theme === "dark" ? "system" : "light"}. Current theme is ${theme}.`}
					>
						{theme === "light" && <Sun />}
						{theme === "dark" && <Moon />}
						{theme === "system" && <Monitor />}
					</Button>
				</TooltipTrigger>
				<TooltipContent>Toggle theme</TooltipContent>
			</Tooltip>
		</div>
	);
}
