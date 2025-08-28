import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProviderRedux } from "@/components/auth-provider-redux"
import { ThemeProvider } from "@/components/theme-provider"
import { ReduxProvider } from "@/lib/redux"

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "Bizzlink - Connect. Create. Collaborate.",
  description: "The premier freelance platform connecting talented professionals with innovative businesses worldwide.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ReduxProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <AuthProviderRedux>{children}</AuthProviderRedux>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
