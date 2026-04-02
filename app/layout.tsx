import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css"; 
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Toaster } from 'react-hot-toast';
import AntdClientPatch from "./AntdClientPatch";

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
        className={`${poppins.className}  antialiased`}  suppressHydrationWarning
      >
        <AntdClientPatch />
        <AntdRegistry>{children}</AntdRegistry>
        <Toaster 
          position="top-center" 
          reverseOrder={false} 
          toastOptions={{
            style: {
              background: '#232325',
              color: '#fff',
              border: '1px solid #333',
              padding: '16px',
            },
            success: {
              iconTheme: {
                primary: '#4ade80',
                secondary: '#232325',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#232325',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
