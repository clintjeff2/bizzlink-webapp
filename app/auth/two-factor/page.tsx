"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function TwoFactorPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isResending, setIsResending] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    // Countdown timer for resend button
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCountdown])

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent multiple characters

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    setError("")

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all fields are filled
    if (newCode.every((digit) => digit !== "") && newCode.join("").length === 6) {
      handleSubmit(newCode.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const newCode = [...code]

    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i]
    }

    setCode(newCode)

    if (pastedData.length === 6) {
      handleSubmit(pastedData)
    }
  }

  const handleSubmit = async (codeToSubmit?: string) => {
    const finalCode = codeToSubmit || code.join("")

    if (finalCode.length !== 6) {
      setError("Please enter the complete 6-digit code")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate 2FA verification
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate different outcomes based on code
      if (finalCode === "123456") {
        setIsSuccess(true)
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        setError("Invalid verification code. Please try again.")
      }
    } catch (error) {
      setError("Verification failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    setError("")

    try {
      // Simulate resending code
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setResendCountdown(60)
    } catch (error) {
      setError("Failed to resend code. Please try again.")
    } finally {
      setIsResending(false)
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
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {isSuccess ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <Shield className="w-8 h-8 text-blue-600" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {isSuccess ? "Verification Successful" : "Two-Factor Authentication"}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {isSuccess
                ? "You have been successfully authenticated"
                : "Enter the 6-digit code sent to your authenticator app"}
            </p>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="text-center space-y-4">
                <p className="text-gray-700">Redirecting to your dashboard...</p>
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="flex justify-center space-x-2" onPaste={handlePaste}>
                    {code.map((digit, index) => (
                      <Input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-12 text-center text-lg font-semibold border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                        disabled={isLoading}
                      />
                    ))}
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
                    <Button
                      variant="ghost"
                      onClick={handleResendCode}
                      disabled={isResending || resendCountdown > 0}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {isResending ? (
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Sending...</span>
                        </div>
                      ) : resendCountdown > 0 ? (
                        `Resend in ${resendCountdown}s`
                      ) : (
                        "Resend Code"
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={() => handleSubmit()}
                  disabled={isLoading || code.some((digit) => !digit)}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    "Verify Code"
                  )}
                </Button>

                <div className="text-center">
                  <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                    Back to Login
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
