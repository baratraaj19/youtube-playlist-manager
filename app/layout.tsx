import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { getServerSession } from "next-auth"
import Providers from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bleash",
  description: "Your video commerce platform",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  return (
    <html lang='en'>
      <body className={inter.className} suppressHydrationWarning>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  )
}
