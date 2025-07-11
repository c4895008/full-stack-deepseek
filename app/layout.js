import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import {AppContextProvider} from "../context/AppContext";
import "./globals.css";

const interSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});



export const metadata = {
  title: "DeepSeek - GreatStack",
  description: "Full Stack Project",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <AppContextProvider>
        <html lang="en">
          <body
            className={`${interSans.variable}  antialiased`}
          >
            {children}
          </body>
        </html>
      </AppContextProvider>
    </ClerkProvider>
  );
}
