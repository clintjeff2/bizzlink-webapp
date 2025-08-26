"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Briefcase, Users, Save, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { GoogleAuth } from "@/components/google-auth"
import { useProgressiveSignup } from "@/lib/redux/useProgressiveSignup"

export default function SignupPage() {
  const {
    signupData,
    currentStep,
    completedSteps,
    loading,
    autoSaving,
    error,
    selectUserType,
    saveBasicInfo,
    saveProfileInfo,
    completeSignup,
    handleGoogleSignup,
    goToStep,
    isStepCompleted,
    canProceedToStep
  } = useProgressiveSignup()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [stepSaved, setStepSaved] = useState<number | null>(null)
  const [selectedUserType, setSelectedUserType] = useState<'freelancer' | 'client' | null>(
    signupData.userType || null
  )
  const [formErrors, setFormErrors] = useState<{
    password?: string
    confirmPassword?: string
    general?: string
  }>({})
  const [localFormData, setLocalFormData] = useState({
    firstname: signupData.firstname || '',
    lastname: signupData.lastname || '',
    email: signupData.email || '',
    password: signupData.password || '',
    confirmPassword: signupData.confirmPassword || '',
    title: signupData.title || '',
    overview: signupData.overview || '',
    skills: signupData.skills || '',
    experience: signupData.experience || '',
    hourlyRate: signupData.hourlyRate || '',
    bio: signupData.bio || '',
    agreeToTerms: signupData.agreeToTerms || false,
  })

  const handleInputChange = (field: string, value: any) => {
    setLocalFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleUserTypeSelect = (userType: 'freelancer' | 'client') => {
    setSelectedUserType(userType)
  }

  const handleStep1Continue = async () => {
    if (!selectedUserType) return
    
    const result = await selectUserType(selectedUserType)
    if (result?.success) {
      setStepSaved(1)
      setTimeout(() => {
        setStepSaved(null)
        goToStep(2) // Move to next step after saving
      }, 1500) // Show success message briefly before proceeding
    }
  }

  const handleStep2Continue = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    setFormErrors({})
    
    // Validate password match
    if (localFormData.password !== localFormData.confirmPassword) {
      setFormErrors({ confirmPassword: 'Passwords do not match' })
      return
    }

    // Validate password strength (basic check)
    if (localFormData.password.length < 6) {
      setFormErrors({ password: 'Password must be at least 6 characters' })
      return
    }

    // Validate required fields
    if (!localFormData.firstname.trim() || !localFormData.lastname.trim() || !localFormData.email.trim()) {
      setFormErrors({ general: 'All fields are required' })
      return
    }

    const result = await saveBasicInfo({
      firstname: localFormData.firstname.trim(),
      lastname: localFormData.lastname.trim(),
      email: localFormData.email.trim(),
      password: localFormData.password,
      confirmPassword: localFormData.confirmPassword
    })
    
    if (result?.success) {
      setStepSaved(2)
      setTimeout(() => {
        setStepSaved(null)
        goToStep(3) // Move to next step after saving
      }, 1500) // Show success message briefly before proceeding
    } else {
      // Handle error case
      setFormErrors({ general: 'Failed to save information. Please try again.' })
      console.error('Failed to save basic information:', result?.error)
    }
  }

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!localFormData.agreeToTerms) {
      return // Handle terms not agreed
    }

    // For freelancers, use freelancer-specific fields
    if (signupData.userType === 'freelancer') {
      const result = await saveProfileInfo({
        title: localFormData.title,
        overview: localFormData.overview,
        skills: localFormData.skills,
        experience: localFormData.experience,
        hourlyRate: localFormData.hourlyRate,
        agreeToTerms: localFormData.agreeToTerms
      })
      
      if (result?.success) {
        setStepSaved(3)
        
        // After saving profile info, complete the signup process
        setTimeout(async () => {
          setStepSaved(null)
          // This will upgrade temp user to full user and redirect to profile setup
          await completeSignup()
        }, 1500) // Show success message briefly before completing signup
      }
    }
    // For clients, we should also handle their signup completion
    else if (signupData.userType === 'client') {
      // Clients might have minimal profile setup, so we can complete signup directly
      await completeSignup()
    }
  }

  const handleGoogleAuth = () => {
    // Use the selected user type from local state, fallback to signupData, then undefined
    const userType = selectedUserType || signupData.userType as 'freelancer' | 'client' || undefined
    handleGoogleSignup(userType)
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
            <CardTitle className="text-2xl font-bold text-gray-900">
              {currentStep === 1 ? "Choose Your Path" : currentStep === 2 ? "Create Account" : "Complete Profile"}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {currentStep === 1
                ? "How do you want to use Bizzlink?"
                : currentStep === 2
                  ? "Enter your basic information"
                  : "Tell us more about yourself"}
            </p>
            
            {/* Progress indicators */}
            <div className="flex justify-center mt-4">
              <div className="flex space-x-2">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full ${
                      i <= currentStep ? "bg-blue-600" : "bg-gray-300"
                    } ${isStepCompleted(i) ? "bg-green-600" : ""}`} 
                  />
                ))}
              </div>
            </div>

            {/* Auto-save indicator */}
            {autoSaving && (
              <div className="flex items-center justify-center mt-2 text-sm text-blue-600">
                <Save className="w-4 h-4 mr-1 animate-pulse" />
                Saving to Firebase & localStorage...
              </div>
            )}

            {/* Loading indicator for steps */}
            {loading && (
              <div className="flex items-center justify-center mt-2 text-sm text-green-600">
                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing step...
              </div>
            )}

            {/* Resume indicator */}
            {signupData.lastSavedAt && currentStep > 1 && (
              <div className="mt-2 text-xs text-green-600">
                Resuming from where you left off
              </div>
            )}

            {/* Step saved success indicator */}
            {stepSaved && (
              <div className="flex items-center justify-center mt-2 text-sm text-green-600">
                <div className="w-4 h-4 rounded-full bg-green-600 flex items-center justify-center mr-2">
                  <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                Step {stepSaved} saved to Firebase & localStorage!
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Alert */}
            {(error || formErrors.general) && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-600">
                  {error || formErrors.general}
                </AlertDescription>
              </Alert>
            )}

            {/* Step 1: User Type Selection */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div
                  onClick={() => handleUserTypeSelect("freelancer")}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedUserType === "freelancer"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">I'm a Freelancer</h3>
                      <p className="text-sm text-gray-600">I want to offer my services and find work</p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => handleUserTypeSelect("client")}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedUserType === "client"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">I'm a Client</h3>
                      <p className="text-sm text-gray-600">I want to hire freelancers for my projects</p>
                    </div>
                  </div>
                </div>

                {/* Continue Button for Step 1 */}
                <Button
                  onClick={handleStep1Continue}
                  disabled={!selectedUserType || loading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 2: Basic Information + Social Auth */}
            {currentStep === 2 && (
              <>

                <form onSubmit={handleStep2Continue} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstname" className="text-sm font-medium text-gray-700">
                        First Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="firstname"
                          type="text"
                          placeholder="John"
                          value={localFormData.firstname}
                          onChange={(e) => handleInputChange("firstname", e.target.value)}
                          className="pl-10 h-12 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastname" className="text-sm font-medium text-gray-700">
                        Last Name
                      </Label>
                      <Input
                        id="lastname"
                        type="text"
                        placeholder="Doe"
                        value={localFormData.lastname}
                        onChange={(e) => handleInputChange("lastname", e.target.value)}
                        className="h-12 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={localFormData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10 h-12 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={localFormData.password}
                        onChange={(e) => {
                          handleInputChange("password", e.target.value)
                          // Clear error when user starts typing
                          if (formErrors.password) {
                            setFormErrors(prev => ({ ...prev, password: undefined }))
                          }
                        }}
                        className={`pl-10 pr-10 h-12 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 ${
                          formErrors.password ? 'border-red-300 focus:border-red-500' : ''
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="text-sm text-red-600 mt-1">{formErrors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={localFormData.confirmPassword}
                        onChange={(e) => {
                          handleInputChange("confirmPassword", e.target.value)
                          // Clear error when user starts typing
                          if (formErrors.confirmPassword) {
                            setFormErrors(prev => ({ ...prev, confirmPassword: undefined }))
                          }
                        }}
                        className={`pl-10 pr-10 h-12 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 ${
                          formErrors.confirmPassword ? 'border-red-300 focus:border-red-500' : ''
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formErrors.confirmPassword && (
                      <p className="text-sm text-red-600 mt-1">{formErrors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      onClick={() => goToStep(1)}
                      variant="outline"
                      className="flex-1 h-12 rounded-xl border-gray-200 bg-transparent"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    type="button"
                    onClick={handleGoogleAuth}
                    variant="outline" 
                    className="h-12 rounded-xl border-gray-200 hover:bg-gray-50 bg-transparent"
                    disabled={loading}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" className="h-12 rounded-xl border-gray-200 hover:bg-gray-50 bg-transparent" disabled>
                    <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                      Sign in
                    </Link>
                  </p>
                </div>
              </>
            )}

            {/* Step 3: Profile Setup */}
            {currentStep === 3 && (
              <>
                {/* Freelancer Profile Setup */}
                {signupData.userType === 'freelancer' && (
                  <form onSubmit={handleFinalSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                        Professional Title
                      </Label>
                      <Input
                        id="title"
                        type="text"
                        placeholder="e.g. Full-Stack Developer, UI/UX Designer"
                        value={localFormData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        className="h-12 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="overview" className="text-sm font-medium text-gray-700">
                        Professional Overview
                      </Label>
                      <Textarea
                        id="overview"
                        placeholder="Brief description of your expertise and experience..."
                        value={localFormData.overview}
                        onChange={(e) => handleInputChange("overview", e.target.value)}
                        className="min-h-[100px] border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skills" className="text-sm font-medium text-gray-700">
                        Skills (comma separated)
                      </Label>
                      <Input
                        id="skills"
                        type="text"
                        placeholder="React, Node.js, Python, Design..."
                        value={localFormData.skills}
                        onChange={(e) => handleInputChange("skills", e.target.value)}
                        className="h-12 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience" className="text-sm font-medium text-gray-700">
                        Years of Experience
                      </Label>
                      <Select value={localFormData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                        <SelectTrigger className="h-12 border-gray-200 rounded-xl">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1">0-1 years</SelectItem>
                          <SelectItem value="2-3">2-3 years</SelectItem>
                          <SelectItem value="4-5">4-5 years</SelectItem>
                          <SelectItem value="6-10">6-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate" className="text-sm font-medium text-gray-700">
                        Hourly Rate (USD)
                      </Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        placeholder="25"
                        value={localFormData.hourlyRate}
                        onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                        className="h-12 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                        min="1"
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={localFormData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                      />
                      <Label htmlFor="terms" className="text-sm text-gray-600">
                        I agree to the{" "}
                        <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        type="button"
                        onClick={() => goToStep(2)}
                        variant="outline"
                        className="flex-1 h-12 rounded-xl border-gray-200 bg-transparent"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading || !localFormData.agreeToTerms}
                        className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg"
                      >
                        {loading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Creating Account...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span>Complete Signup</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Client Terms Agreement */}
                {signupData.userType === 'client' && (
                  <form onSubmit={handleFinalSubmit} className="space-y-6">
                    <div className="text-center space-y-4">
                      <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                        <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                          <Users className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Almost Done!</h3>
                        <p className="text-gray-600">
                          Complete your signup to start hiring talented freelancers for your projects.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms-client"
                        checked={localFormData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                      />
                      <Label htmlFor="terms-client" className="text-sm text-gray-600">
                        I agree to the{" "}
                        <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        type="button"
                        onClick={() => goToStep(2)}
                        variant="outline"
                        className="flex-1 h-12 rounded-xl border-gray-200 bg-transparent"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading || !localFormData.agreeToTerms}
                        className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold shadow-lg"
                      >
                        {loading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Creating Account...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span>Complete Signup</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
