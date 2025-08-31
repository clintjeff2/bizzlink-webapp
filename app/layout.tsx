import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AuthProviderRedux } from "@/components/auth-provider-redux"
import { ThemeProvider } from "@/components/theme-provider"
import { ReduxProvider } from "@/lib/redux"

// Use system fonts as fallback to avoid Google Fonts timeout issues
const fontFamily = {
  variable: '--font-inter',
  className: 'font-inter'
}

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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className={`${fontFamily.variable} font-sans`}>
        <ReduxProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <AuthProviderRedux>{children}</AuthProviderRedux>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
