import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Simtra App",
	description: "Powered by Desarrollo",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
			 	className={`${geistSans.variable} ${geistMono.variable} antialiased`} 
			>
				<div className="flex flex-col h-screen">
					{children}
				</div>
			<Toaster />
			</body>
		</html>
	);
}
