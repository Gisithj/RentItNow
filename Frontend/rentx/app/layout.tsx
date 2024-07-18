'use client'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers/providers";
import NavBar from "./components/navbar";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "RentX",
//   description: "Rent anything",
// };


export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>
)

{
 
const pathname = usePathname() 
const showNavBar = !['/auth/sign-in', '/auth/sign-up'].includes(pathname);

  return (
    <html lang="en" className='light'>
      <body className={inter.className}>
      <Providers>
      {showNavBar &&<NavBar/> }
        {children}
      </Providers>
      </body>
    </html>
  );
}
