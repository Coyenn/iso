import { Cog } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/src/components/ui/tooltip";

export function SettingsButton() {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button variant="ghost" size="icon" asChild>
					<Link href="/settings">
						<Cog />
					</Link>
				</Button>
			</TooltipTrigger>
			<TooltipContent>Settings</TooltipContent>
		</Tooltip>
	);
}
