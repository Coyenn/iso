import "@/src/styles/globals.css";

import type { Metadata } from "next";
import { Instrument_Serif, Inter, Newsreader } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/src/components/providers/theme-provider";
import { Toaster } from "@/src/components/ui/sonner";
import { getCustomStylesheet } from "@/src/server/actions/stylesheet/get-custom-stylesheet";
import { getConfig } from "@/src/server/get-config";
import { CurrentServicesProvider } from "@/src/store/current-services-context";

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

export interface RootLayoutProps {
	children: React.ReactNode;
}

export default async function RootLayout(props: RootLayoutProps) {
	const { children } = props;
	const config = await getConfig();
	const customStylesheet = await getCustomStylesheet();

	return (
		<html
			lang={config.locale ?? "en"}
			className={`${inter.variable} ${newsreader.variable} ${instrumentSerif.variable}`}
			suppressHydrationWarning
		>
			<head>
				<title>{config.title}</title>
				{customStylesheet && typeof customStylesheet === "string" && (
					<style
						// biome-ignore lint/security/noDangerouslySetInnerHtml: This is a custom stylesheet
						dangerouslySetInnerHTML={{ __html: customStylesheet }}
					/>
				)}
			</head>
			<body
				className={`theme-${config.theme ?? "neutral"} flex min-h-[calc(100vh-10rem)] flex-col overflow-x-hidden bg-background antialiased`}
			>
				<NextIntlClientProvider>
					<SessionProvider>
						<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
							<CurrentServicesProvider initialServices={config.services}>
								{children}
							</CurrentServicesProvider>
							<Toaster />
						</ThemeProvider>
					</SessionProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
