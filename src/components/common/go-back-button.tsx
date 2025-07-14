"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/src/components/ui/button";

export interface GoBackButtonProps {
	href: string;
	title: string;
}

export function GoBackButton(props: GoBackButtonProps) {
	const { href, title } = props;
	const pathname = usePathname();

	if (pathname === href) {
		return null;
	}

	return (
		<Button className="absolute top-4 left-4" variant="ghost" asChild>
			<Link href={href}>
				<ArrowLeft />
				{title}
			</Link>
		</Button>
	);
}
