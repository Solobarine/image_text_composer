import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Image Text Composer",
  description: "An interactive text editor built with Konva and Next.js App Router, featuring six unique Google Fonts — Inter, Poppins, Mea Culpa, UnifrakturMaguntia, Press Start 2P, and Roboto. Users can render beautifully styled text on canvas with accurate font loading, ensuring pixel-perfect design without fallback issues.",
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Poppins:wght@400;500;700&family=Mea+Culpa&family=UnifrakturMaguntia&family=Press+Start+2P&family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
