import "@/src/styles/globals.css";

import type { Metadata } from "next";
import { Instrument_Serif, Inter, Newsreader } from "next/font/google";

import { ThemeProvider } from "@/src/components/providers/theme-provider";
import { Toaster } from "@/src/components/ui/sonner";

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

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			lang="en"
			className={`${inter.variable} ${newsreader.variable} ${instrumentSerif.variable}`}
			suppressHydrationWarning
			data-primary="brand"
			data-secondary="brand"
			data-surface="sand"
		>
			<body className="flex min-h-screen flex-col antialiased">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					disableTransitionOnChange
					enableSystem
				>
					<main className="container-wrapper relative flex-1">{children}</main>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
