"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Mail, RefreshCw } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "error" | "expired">("loading")
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationStatus("error")
        return
      }

      try {
        // Simulate email verification
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Simulate different outcomes based on token
        if (token === "expired") {
          setVerificationStatus("expired")
        } else if (token === "invalid") {
          setVerificationStatus("error")
        } else {
          setVerificationStatus("success")
        }
      } catch (error) {
        setVerificationStatus("error")
      }
    }

    verifyEmail()
  }, [token])

  const handleResendVerification = async () => {
    setIsResending(true)
    setResendSuccess(false)

    try {
      // Simulate resending verification email
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setResendSuccess(true)
    } catch (error) {
      console.error("Failed to resend verification email")
    } finally {
      setIsResending(false)
    }
  }

  const renderContent = () => {
    switch (verificationStatus) {
      case "loading":
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verifying Your Email</h3>
              <p className="text-gray-600">Please wait while we verify your email address...</p>
            </div>
          </div>
        )

      case "success":
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Verified Successfully!</h3>
              <p className="text-gray-600 mb-4">
                Your email address has been verified. You can now access all features of your account.
              </p>
            </div>
            <Button
              asChild
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold"
            >
              <Link href="/auth/login">Continue to Login</Link>
            </Button>
          </div>
        )

      case "expired":
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verification Link Expired</h3>
              <p className="text-gray-600 mb-4">
                This verification link has expired. Please request a new verification email.
              </p>
            </div>
            {resendSuccess ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  A new verification email has been sent to {email || "your email address"}.
                </AlertDescription>
              </Alert>
            ) : (
              <Button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold"
              >
                {isResending ? (
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Resend Verification Email</span>
                  </div>
                )}
              </Button>
            )}
          </div>
        )

      case "error":
      default:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verification Failed</h3>
              <p className="text-gray-600 mb-4">
                We couldn't verify your email address. The link may be invalid or expired.
              </p>
            </div>
            <div className="space-y-3">
              <Button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold"
              >
                {isResending ? (
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Resend Verification Email</span>
                  </div>
                )}
              </Button>
              <Button asChild variant="outline" className="w-full h-12 rounded-xl bg-transparent">
                <Link href="/auth/signup">Back to Signup</Link>
              </Button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Image src="/images/bizzlink-icon.png" alt="Bizzlink" width={40} height={40} className="w-10 h-10" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Bizzlink
            </span>
          </Link>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">Email Verification</CardTitle>
            <p className="text-gray-600 mt-2">Verifying your email address to complete your account setup</p>
          </CardHeader>
          <CardContent>{renderContent()}</CardContent>
        </Card>
      </div>
    </div>
  )
}
