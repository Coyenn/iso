import "@/src/styles/globals.css";

import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { Instrument_Serif, Inter, Newsreader } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/src/components/providers/theme-provider";
import { Toaster } from "@/src/components/ui/sonner";
import { getConfig } from "@/src/server/get-config";

export const metadata: Metadata = {
	description: "A simple services dashboard",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

const newsreader = Newsreader({
	subsets: ["latin"],
	style: "italic",
	variable: "--font-newsreader",
});

const instrumentSerif = Instrument_Serif({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-instrument-serif",
});

function getCustomStylesheets(): string[] {
	try {
		const cssDir = path.join(process.cwd(), "public", "css");
		return fs
			.readdirSync(cssDir)
			.filter((file) => file.endsWith(".css"))
			.map((file) => `/css/${file}`);
	} catch {
		return [];
	}
}

export interface RootLayoutProps {
	children: React.ReactNode;
}

export default async function RootLayout(props: RootLayoutProps) {
	const { children } = props;
	const config = await getConfig();
	const customStylesheets = getCustomStylesheets();

	return (
		<html
			lang={config.locale ?? "en"}
			className={`${inter.variable} ${newsreader.variable} ${instrumentSerif.variable}`}
			suppressHydrationWarning
		>
			<head>
				<title>{config.title}</title>
				{customStylesheets.map((href) => (
					<link key={href} rel="stylesheet" href={href} />
				))}
			</head>
			<body className="flex min-h-screen flex-col bg-background antialiased">
				<NextIntlClientProvider>
					<SessionProvider>
						<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
							{children}
							<Toaster />
						</ThemeProvider>
					</SessionProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
