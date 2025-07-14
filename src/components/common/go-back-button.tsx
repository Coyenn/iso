"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/button";

export interface GoBackButtonProps {
	href: string;
	title?: string;
}

export function GoBackButton(props: GoBackButtonProps) {
	const { href, title } = props;
	const pathname = usePathname();
	const t = useTranslations();

	if (pathname === href) {
		return null;
	}

	return (
		<Button className="absolute top-4 left-4" variant="ghost" asChild>
			<Link href={href}>
				<ArrowLeft />
				{title ?? t("goBack")}
			</Link>
		</Button>
	);
}
