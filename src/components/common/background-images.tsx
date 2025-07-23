"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/src/lib/utils";

export interface BackgroundImagesProps {
	light: string;
	dark: string;
}

export function BackgroundImages(props: BackgroundImagesProps) {
	const { light, dark } = props;
	const pathname = usePathname();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<div
			className={cn(
				"-inset-8 fixed opacity-50 blur-xs",
				pathname !== "/" && "opacity-0",
			)}
		>
			{light && (
				<Image
					src={light}
					alt="Background image"
					fill
					priority
					loading="eager"
					className="w-full object-cover dark:hidden"
				/>
			)}
			{dark && (
				<Image
					src={dark}
					alt="Background image"
					fill
					className="hidden object-cover dark:block"
				/>
			)}
		</div>
	);
}
