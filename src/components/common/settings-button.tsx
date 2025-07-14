import { Cog } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/src/components/ui/tooltip";

export function SettingsButton() {
	const t = useTranslations("tooltips");

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button variant="ghost" size="icon" asChild>
					<Link href="/settings">
						<Cog />
					</Link>
				</Button>
			</TooltipTrigger>
			<TooltipContent>{t("settings")}</TooltipContent>
		</Tooltip>
	);
}
