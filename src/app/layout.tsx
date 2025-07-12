import "@/src/styles/globals.css";

import type { Metadata } from "next";
import { Instrument_Serif, Inter, Newsreader } from "next/font/google";

import { ThemeProvider } from "@/src/components/providers/theme-provider";
import { Toaster } from "@/src/components/ui/sonner";
import { ThemeToggle } from "@/src/components/ui/theme-toggle";
import { getConfig } from "@/src/server/get-config";

export const metadata: Metadata = {
	title: "ISO Dashboard",
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

export interface RootLayoutProps {
	children: React.ReactNode;
}

export default async function RootLayout(props: RootLayoutProps) {
	const { children } = props;
	const config = await getConfig();

	return (
		<html
			lang={config.locale ?? "en"}
			className={`${inter.variable} ${newsreader.variable} ${instrumentSerif.variable}`}
			suppressHydrationWarning
		>
			<body className="flex min-h-screen flex-col antialiased">
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<ThemeToggle />
					<main className="container-wrapper relative flex-1">{children}</main>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
