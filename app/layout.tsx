import "@/styles/globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import { Suspense, lazy } from "react";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import PageLoading from "@/components/PageLoading";
import { ImageProvider } from "@/providers/ImageContext";


export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon-16x16.png",
		apple: "/apple-touch-icon.png",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {

	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body
				className={clsx(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable
				)}
			>   
			  
				<Providers themeProps={{ attribute: "class", defaultTheme: "white" }}>
					
				<ImageProvider>
						<main className="w-full mainContainer " >
						
							{children}
						
						</main>
				</ImageProvider>
						
					
				</Providers>
			</body>
		</html>
	);
}
