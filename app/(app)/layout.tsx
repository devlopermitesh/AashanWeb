import type { Metadata } from "next";
import { DM_Sans,Roboto,Space_Grotesk} from "next/font/google";

import "@/app/globals.css";

import { ClerkProvider } from '@clerk/nextjs'
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans", 
});
const roboto = Roboto({
  weight: ['400', '700'], // Specify desired weights
  subsets: ['latin'],    // Specify required subsets
  display: 'swap',       // Optional: control font loading behavior
  variable: '--font-roboto', // Optional: use as CSS variable
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap', // Optional: ensures text is visible while the font loads
  variable: '--font-space-grotesk', // Optional: for use with CSS variables or Tailwind
});

export const metadata: Metadata = {
  title: "Aashan",
  description: "Make your online Bussiness Journey Aashan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${dmSans.variable} ${roboto.variable} ${spaceGrotesk.variable} antialiased`}
      >
      
        {children}
      </body>
    </html>
    </ClerkProvider>

  );
}
