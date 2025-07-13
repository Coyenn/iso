import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";

export interface GoBackButtonProps {
	href: string;
	title: string;
}

export function GoBackButton(props: GoBackButtonProps) {
	const { href, title } = props;

	return (
		<Button className="absolute top-4 left-4" variant="ghost" asChild>
			<Link href={href}>
				<ArrowLeft />
				{title}
			</Link>
		</Button>
	);
}
