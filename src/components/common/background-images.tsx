"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/src/lib/utils";

export interface BackgroundImagesProps {
	light: string;
	dark: string;
	opacity?: number;
	blur?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

export function BackgroundImages(props: BackgroundImagesProps) {
	const { light, dark, opacity = 50, blur = "xs" } = props;
	const pathname = usePathname();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	const blurMap: Record<string, string> = {
		none: "0px",
		xs: "2px",
		sm: "4px",
		md: "6px",
		lg: "8px",
		xl: "10px",
		"2xl": "12px",
		"3xl": "16px",
	};

	const computedOpacity = pathname !== "/" ? 0 : opacity / 100;
	const computedBlur = pathname !== "/" ? "0px" : (blurMap[blur] ?? "2px");

	return (
		<div
			className={cn("-inset-8 fixed")}
			style={{ opacity: computedOpacity, filter: `blur(${computedBlur})` }}
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
