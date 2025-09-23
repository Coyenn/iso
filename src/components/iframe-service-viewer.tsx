"use client";

import { ExternalLink, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { useOpenIframeStore } from "@/src/store/open-iframe-store";

export function IframeServiceViewer() {
	const t = useTranslations();
	const { openIframe, setOpenIframe } = useOpenIframeStore();
	const [iframeLoaded, setIframeLoaded] = useState(false);

	useEffect(() => {
		if (openIframe === null) {
			setIframeLoaded(false);
		}
	}, [openIframe]);

	return (
		<AnimatePresence mode="wait">
			{openIframe && (
				<>
					<motion.div
						className="fixed inset-0 z-[51] h-full w-full bg-black/50"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25, ease: "easeInOut" }}
					/>
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ duration: 0.25, ease: "easeInOut" }}
						className="fixed inset-2 z-[52] overflow-clip bg-background shadow-2xl md:inset-5 md:rounded-lg"
					>
						<iframe
							src={openIframe}
							title={openIframe}
							className={cn(
								"h-full w-full bg-transparent",
								!iframeLoaded && "hidden",
							)}
							onLoad={() => setTimeout(() => setIframeLoaded(true), 250)}
						/>
						<div className="absolute top-2 right-2 flex items-center gap-2">
							<Button
								variant="secondary"
								size="icon"
								onClick={() => window.open(openIframe, "_blank")}
								aria-label={t("openInNewTab")}
							>
								<ExternalLink />
							</Button>
							<Button
								variant="secondary"
								size="icon"
								onClick={() => setOpenIframe(null)}
								aria-label={t("close")}
							>
								<X />
							</Button>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
