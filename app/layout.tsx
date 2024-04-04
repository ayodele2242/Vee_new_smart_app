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
import Metrics from './metrics';



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
			
				<Metrics />

				<script id="inline-script"
				dangerouslySetInnerHTML={{
					__html: `((function(d, src, c) { var t=d.scripts[d.scripts.length - 1],s=d.createElement('script');s.id='la_x2s6df8d';s.defer=true;s.src=src;s.onload=s.onreadystatechange=function(){var rs=this.readyState;if(rs&&(rs!='complete')&&(rs!='loaded')){return;}c(this);};t.parentElement.insertBefore(s,t.nextSibling);})(document,
						'https://veestore.ladesk.com/scripts/track.js',
						function(e){ LiveAgent.createButton('2uu9zqsg', e); })`,
				}}
				></script>
				
			</body>
			
		</html>
	);
}
