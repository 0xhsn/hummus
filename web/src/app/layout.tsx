import PropTypes from "prop-types";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "./ApolloWrapper";
import { ThemeProvider } from "@/components/theme-provider";
import Nav from "./nav";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reddit",
  description: "wanna be full-stack dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="flex flex-col items-center justify-between">
              <Nav />
              {children}
            </main>
          </ThemeProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};