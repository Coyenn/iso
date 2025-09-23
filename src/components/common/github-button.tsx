"use client";

import { GithubIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/src/components/ui/tooltip";

export function GithubButton() {
	const t = useTranslations("tooltips");
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button size={"icon"} variant={"ghost"} aria-label="GitHub" asChild>
					<Link href="https://github.com/Coyenn/iso" target="_blank">
						<GithubIcon />
					</Link>
				</Button>
			</TooltipTrigger>
			<TooltipContent>{t("github")}</TooltipContent>
		</Tooltip>
	);
}
