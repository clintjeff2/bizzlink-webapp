"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowRight, ArrowLeft, DollarSign, Clock, TrendingUp, Info, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useOnboardingData } from "@/lib/redux/useOnboardingData"
import { useToast } from "@/hooks/use-toast"

const experienceLevels = [
  { value: "entry", label: "Entry Level", range: "$10-25/hr", description: "New to freelancing" },
  { value: "intermediate", label: "Intermediate", range: "$25-50/hr", description: "Some experience" },
  { value: "expert", label: "Expert", range: "$50-100+/hr", description: "Highly experienced" },
]

const currencies = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "CAD", label: "CAD ($)" },
  { value: "AUD", label: "AUD ($)" },
]

export default function RatesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { 
    onboardingData, 
    saveRates, 
    isLoading, 
    error,
    hasData 
  } = useOnboardingData()
  
  // Helper function to get currency symbol
  const getCurrencySymbol = (currencyCode: string) => {
    switch(currencyCode) {
      case 'USD':
      case 'CAD':
      case 'AUD':
        return '$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      default:
        return '$';
    }
  }
  
  const [pricingModel, setPricingModel] = useState("")
  const [hourlyRate, setHourlyRate] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [experienceLevel, setExperienceLevel] = useState("")
  const [minimumProject, setMinimumProject] = useState("")
  const [availability, setAvailability] = useState("")
  const [formData, setFormData] = useState({
    professionalTitle: "",
    overview: ""
  })
  const [isSaving, setIsSaving] = useState(false)

  // Load existing data when component mounts
  useEffect(() => {
    if (hasData && onboardingData?.rates) {
      const hourRate = onboardingData.rates.hourRate || ""
      const title = onboardingData.rates.title || ""
      const overview = onboardingData.rates.overview || ""
      
      // Only update if we have actual data
      if (hourRate) setHourlyRate(hourRate)
      if (title || overview) {
        setFormData({
          professionalTitle: title,
          overview: overview
        })
      }
    }
  }, [hasData])

  const handleNext = async () => {
    if (!hourlyRate?.trim() || !formData.professionalTitle?.trim()) {
      toast({
        title: "Please complete your profile",
        description: "Hourly rate and professional title are required.",
        variant: "destructive"
      })
      return
    }

    try {
      setIsSaving(true)
      
      // Format hourly rate with the correct currency symbol
      const currencySymbol = getCurrencySymbol(currency);
      const formattedRate = `${currencySymbol}${hourlyRate}`;
      
      const success = await saveRates(formattedRate, formData.professionalTitle, formData.overview)
      
      if (success) {
        toast({
          title: "Profile completed!",
          description: "Your freelancer profile has been saved successfully."
        })
        router.push("/freelancer/onboarding/location")
      } else {
        throw new Error("Failed to save profile data")
      }
    } catch (err: any) {
      toast({
        title: "Error saving profile",
        description: err.message || "Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getRecommendedRate = () => {
    const level = experienceLevels.find((l) => l.value === experienceLevel)
    return level ? level.range : ""
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                6
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Rates & Pricing</h1>
                <p className="text-gray-600">Set your pricing and availability</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">Step 6 of 7</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85.7%" }}></div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Pricing Model */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900">Pricing Model</CardTitle>
                  <p className="text-gray-600 mt-1">Choose how you want to charge for your services</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <RadioGroup value={pricingModel} onValueChange={setPricingModel} className="space-y-4">
                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                  <RadioGroupItem value="hourly" id="hourly" />
                  <div className="flex-1">
                    <Label htmlFor="hourly" className="text-base font-medium text-gray-900 cursor-pointer">
                      Hourly Rate
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">Charge clients based on the time you spend working</p>
                  </div>
                  <Clock className="w-5 h-5 text-gray-400" />
                </div>

                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                  <RadioGroupItem value="project" id="project" />
                  <div className="flex-1">
                    <Label htmlFor="project" className="text-base font-medium text-gray-900 cursor-pointer">
                      Fixed Project Rate
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">Charge a fixed amount for the entire project</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Professional Title and Overview */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl text-gray-900">Professional Profile</CardTitle>
              <p className="text-gray-600">Complete your professional identity</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="professionalTitle" className="text-sm font-medium text-gray-700">
                  Professional Title *
                </Label>
                <Input
                  id="professionalTitle"
                  placeholder="e.g., Senior Full Stack Developer, UX/UI Designer"
                  value={formData.professionalTitle}
                  onChange={(e) => setFormData({ ...formData, professionalTitle: e.target.value })}
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="overview" className="text-sm font-medium text-gray-700">
                  Professional Overview *
                </Label>
                <textarea
                  id="overview"
                  placeholder="Describe your professional background, expertise, and what makes you unique..."
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          {/* Rate Setting */}
          {pricingModel === "hourly" && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl text-gray-900">Set Your Hourly Rate</CardTitle>
                <p className="text-gray-600">This is the rate you'll charge per hour of work</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm font-medium text-gray-700">
                      Experience Level
                    </Label>
                    <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            <div className="flex flex-col">
                              <span>{level.label}</span>
                              <span className="text-xs text-gray-500">{level.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {experienceLevel && (
                      <div className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 p-2 rounded-lg">
                        <Info className="w-4 h-4" />
                        <span>Recommended range: {getRecommendedRate()}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-sm font-medium text-gray-700">
                      Currency
                    </Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((curr) => (
                          <SelectItem key={curr.value} value={curr.value}>
                            {curr.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hourlyRate" className="text-sm font-medium text-gray-700">
                    Hourly Rate *
                  </Label>
                  <div className="relative">
                    {currency === 'USD' || currency === 'CAD' || currency === 'AUD' ? (
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    ) : (
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg font-medium">
                        {getCurrencySymbol(currency)}
                      </span>
                    )}
                    <Input
                      id="hourlyRate"
                      type="number"
                      placeholder="25"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="pl-10 h-12 text-lg font-semibold"
                      min="1"
                      step="0.01"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      per hour
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    This is your base rate. You can adjust it for specific projects.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Rate Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Your rate:</span>
                      <span className="font-medium">
                        {getCurrencySymbol(currency)}{hourlyRate || "0"}/hr
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform fee (10%):</span>
                      <span className="text-red-600">
                        -{getCurrencySymbol(currency)}
                        {((Number.parseFloat(hourlyRate) || 0) * 0.1).toFixed(2)}/hr
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>You'll receive:</span>
                      <span className="text-green-600">
                        {getCurrencySymbol(currency)}
                        {((Number.parseFloat(hourlyRate) || 0) * 0.9).toFixed(2)}/hr
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Project Minimums */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl text-gray-900">Project Preferences</CardTitle>
              <p className="text-gray-600">Set your minimum project requirements</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="minimumProject" className="text-sm font-medium text-gray-700">
                    Minimum Project Value
                  </Label>
                  <div className="relative">
                    {currency === 'USD' || currency === 'CAD' || currency === 'AUD' ? (
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    ) : (
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg font-medium">
                        {getCurrencySymbol(currency)}
                      </span>
                    )}
                    <Input
                      id="minimumProject"
                      type="number"
                      placeholder="100"
                      value={minimumProject}
                      onChange={(e) => setMinimumProject(e.target.value)}
                      className="pl-10 h-12"
                      min="0"
                    />
                  </div>
                  <p className="text-xs text-gray-500">The minimum amount you're willing to work for on a project</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability" className="text-sm font-medium text-gray-700">
                    Weekly Availability
                  </Label>
                  <Select value={availability} onValueChange={setAvailability}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select your availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less-than-10">Less than 10 hours/week</SelectItem>
                      <SelectItem value="10-20">10-20 hours/week</SelectItem>
                      <SelectItem value="20-30">20-30 hours/week</SelectItem>
                      <SelectItem value="30-40">30-40 hours/week</SelectItem>
                      <SelectItem value="more-than-40">More than 40 hours/week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between pt-6">
            <Button asChild variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Link href="/freelancer/onboarding/skills">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Link>
            </Button>

            <Button
              onClick={handleNext}
              disabled={!hourlyRate?.trim() || !formData.professionalTitle?.trim() || isSaving}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center space-x-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
  )
}
