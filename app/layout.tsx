import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Duaelity",
  description: `Duaelity: The easiest way to create and join Brawlhalla tournaments. Level up your competitive game!`,
  keywords: "brawlhalla, tournament, brackets, game, video game, ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="/images/Duaelity_logo.png"
          sizes="32x32"
          type="image/png"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-white bg-[url('/images/brawlhalla-bg-1.jpg')]`}
      >
        {children}
      </body>
    </html>
  );
}
