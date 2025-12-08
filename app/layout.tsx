import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css"; 
import { AntdRegistry } from '@ant-design/nextjs-registry';

const poppins = Poppins({
  variable: "--font-poppins", 
   weight: ["300","400", "500", "600", "700", "800" , "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "e.hub admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className}  antialiased`}
      >
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
