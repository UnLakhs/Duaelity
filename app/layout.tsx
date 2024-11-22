  import type { Metadata } from "next";
  import "./globals.css";
  import NavBar from "./components/Navbar";

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
          className={`antialiased text-white`}
        >
          <NavBar />
          {children}
        </body>
      </html>
    );
  }
