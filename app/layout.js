import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalContextProvider from "./context/GlobalContext";
import QueryProvider from "./components/TanStack/QueryProvider";
import UserAuthProvider from "./context/UserAuthProvider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Shop.co",
  description: "Your exclusive ecommerce store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <GlobalContextProvider>
            <UserAuthProvider>{children}</UserAuthProvider>
          </GlobalContextProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
