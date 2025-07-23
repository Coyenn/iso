"use client";

import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { searchWithEngine } from "@/src/lib/search-with-engine";
import { cn } from "@/src/lib/utils";
import type { Config } from "@/src/schemas/config-schema";

export interface SearchbarProps extends React.ComponentProps<"div"> {
	config: Config;
}

export function Searchbar(props: SearchbarProps) {
	const { config, className } = props;
	const t = useTranslations();
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [query, setQuery] = useState("");

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (!query.trim()) return;

		const searchUrl = searchWithEngine(
			config.search?.engine || "google",
			encodeURIComponent(query.trim()),
			config.search?.engineUrl || "",
		);

		if (searchUrl) {
			window.open(searchUrl, "_blank", "noopener,noreferrer");
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			if (!query.trim()) return;

			const searchUrl = searchWithEngine(
				config.search?.engine || "google",
				encodeURIComponent(query.trim()),
				config.search?.engineUrl || "",
			);

			if (searchUrl) {
				window.open(searchUrl, "_blank", "noopener,noreferrer");
			}
		}
	};

	useEffect(() => {
		if (config.search?.enabled) {
			searchInputRef.current?.focus();
		}
	}, [config.search?.enabled]);

	return (
		<motion.div
			initial={{ opacity: 0, y: 10, scale: 0.95 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{
				duration: config.pageLoadAnimation ? 0.2 : 0,
				ease: "easeInOut",
				delay: config.pageLoadAnimation ? 0.1 : 0,
			}}
			className={cn("w-full max-w-2xl", className)}
		>
			<form onSubmit={handleSearch} className="relative">
				{/** biome-ignore lint/a11y/noStaticElementInteractions: Very searchbar specific markup */}
				{/** biome-ignore lint/a11y/useKeyWithClickEvents: Very searchbar specific markup */}
				<div
					onClick={() => searchInputRef.current?.focus()}
					className={cn(
						"relative flex w-full cursor-text items-center gap-2 rounded-lg shadow-lg transition-colors sm:px-4 sm:py-3 md:rounded-xl",
						"border border-foreground/15 bg-border/50 px-2 py-2 backdrop-blur-md dark:border-input/75 dark:bg-border/60",
					)}
				>
					<Input
						type="text"
						name="search"
						placeholder={config.search?.placeholder || t("searchPlaceholder")}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={handleKeyPress}
						ref={searchInputRef}
						className={cn(
							"!bg-transparent flex-1 border-none p-0 text-sm shadow-none md:text-base",
							"placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0",
						)}
					/>
					<Button
						type="submit"
						size="sm"
						className="flex-shrink-0 rounded-full"
						disabled={!query.trim()}
					>
						<Search className="h-4 w-4" />
						<span className="sr-only">Search</span>
					</Button>
				</div>
			</form>
		</motion.div>
	);
}
