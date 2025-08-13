"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/navigation"
import { ArrowRight, ArrowLeft, MapPin, Globe, Clock, Languages, User, Phone, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Switzerland",
  "Austria",
  "Belgium",
  "Portugal",
  "Ireland",
  "New Zealand",
  "Japan",
  "South Korea",
  "Singapore",
  "Hong Kong",
  "India",
  "Brazil",
  "Mexico",
  "Argentina",
  "Chile",
  "Colombia",
  "South Africa",
  "Nigeria",
  "Kenya",
  "Egypt",
  "Morocco",
  "Israel",
  "Turkey",
  "Russia",
  "Ukraine",
  "Poland",
  "Czech Republic",
  "Hungary",
  "Romania",
  "Bulgaria",
  "Croatia",
  "Serbia",
  "Greece",
  "Cyprus",
  "Malta",
  "Luxembourg",
  "Estonia",
  "Latvia",
  "Lithuania",
  "Slovenia",
  "Slovakia",
  "Other",
]

const timezones = [
  "UTC-12:00 (Baker Island)",
  "UTC-11:00 (American Samoa)",
  "UTC-10:00 (Hawaii)",
  "UTC-09:00 (Alaska)",
  "UTC-08:00 (Pacific Time)",
  "UTC-07:00 (Mountain Time)",
  "UTC-06:00 (Central Time)",
  "UTC-05:00 (Eastern Time)",
  "UTC-04:00 (Atlantic Time)",
  "UTC-03:00 (Argentina)",
  "UTC-02:00 (South Georgia)",
  "UTC-01:00 (Azores)",
  "UTC+00:00 (London, Dublin)",
  "UTC+01:00 (Paris, Berlin)",
  "UTC+02:00 (Cairo, Athens)",
  "UTC+03:00 (Moscow, Istanbul)",
  "UTC+04:00 (Dubai, Baku)",
  "UTC+05:00 (Karachi, Tashkent)",
  "UTC+05:30 (Mumbai, Delhi)",
  "UTC+06:00 (Dhaka, Almaty)",
  "UTC+07:00 (Bangkok, Jakarta)",
  "UTC+08:00 (Beijing, Singapore)",
  "UTC+09:00 (Tokyo, Seoul)",
  "UTC+10:00 (Sydney, Melbourne)",
  "UTC+11:00 (Solomon Islands)",
  "UTC+12:00 (Auckland, Fiji)",
]

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Dutch",
  "Russian",
  "Chinese (Mandarin)",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
  "Bengali",
  "Urdu",
  "Turkish",
  "Polish",
  "Swedish",
  "Norwegian",
  "Danish",
  "Finnish",
  "Greek",
  "Hebrew",
  "Thai",
  "Vietnamese",
  "Indonesian",
  "Malay",
  "Tagalog",
  "Other",
]

export default function LocationPage() {
  const router = useRouter()
  const [country, setCountry] = useState("")
  const [city, setCity] = useState("")
  const [timezone, setTimezone] = useState("")
  const [primaryLanguage, setPrimaryLanguage] = useState("")
  const [additionalLanguages, setAdditionalLanguages] = useState<string[]>([])
  const [phoneNumber, setPhoneNumber] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [bio, setBio] = useState("")
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [githubUrl, setGithubUrl] = useState("")

  const addLanguage = (language: string) => {
    if (!additionalLanguages.includes(language) && language !== primaryLanguage) {
      setAdditionalLanguages([...additionalLanguages, language])
    }
  }

  const removeLanguage = (language: string) => {
    setAdditionalLanguages(additionalLanguages.filter((lang) => lang !== language))
  }

  const handleNext = () => {
    if (country && city && timezone && primaryLanguage) {
      router.push("/freelancer/onboarding/complete")
    }
  }

  const handleSkip = () => {
    router.push("/freelancer/onboarding/complete")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                7
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Location & Personal Info</h1>
                <p className="text-gray-600">Tell us about yourself and where you're located</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">Step 7 of 7</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "100%" }}></div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Location Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900">Location</CardTitle>
                  <p className="text-gray-600 mt-1">Where are you based? This helps clients find local talent</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                    Country *
                  </Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((countryName) => (
                        <SelectItem key={countryName} value={countryName}>
                          {countryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                    City *
                  </Label>
                  <Input
                    id="city"
                    placeholder="e.g., New York, London, Tokyo"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-sm font-medium text-gray-700">
                  Timezone *
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="pl-10 h-12">
                      <SelectValue placeholder="Select your timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Languages className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900">Languages</CardTitle>
                  <p className="text-gray-600 mt-1">What languages do you speak?</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="primaryLanguage" className="text-sm font-medium text-gray-700">
                  Primary Language *
                </Label>
                <Select value={primaryLanguage} onValueChange={setPrimaryLanguage}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select your primary language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Additional Languages</Label>
                {additionalLanguages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {additionalLanguages.map((language) => (
                      <div
                        key={language}
                        className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                      >
                        {language}
                        <button
                          onClick={() => removeLanguage(language)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {languages
                    .filter((lang) => lang !== primaryLanguage && !additionalLanguages.includes(lang))
                    .slice(0, 8)
                    .map((language) => (
                      <Button
                        key={language}
                        variant="outline"
                        size="sm"
                        onClick={() => addLanguage(language)}
                        className="justify-start text-sm h-8"
                      >
                        + {language}
                      </Button>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900">Personal Information</CardTitle>
                  <p className="text-gray-600 mt-1">Additional details about yourself</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-sm font-medium text-gray-700">
                    Date of Birth
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="dob"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                  About Yourself
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Tell clients about yourself, your background, interests, and what makes you unique..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>This will appear on your profile</span>
                  <span>{bio.length}/1000</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Globe className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900">Professional Links</CardTitle>
                  <p className="text-gray-600 mt-1">Add links to showcase your professional presence</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="text-sm font-medium text-gray-700">
                  LinkedIn Profile
                </Label>
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                  Personal Website/Portfolio
                </Label>
                <Input
                  id="website"
                  placeholder="https://yourwebsite.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="github" className="text-sm font-medium text-gray-700">
                  GitHub Profile
                </Label>
                <Input
                  id="github"
                  placeholder="https://github.com/yourusername"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="h-12"
                />
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

            <div className="flex space-x-3">
              <Button variant="ghost" onClick={handleSkip} className="text-gray-600 hover:text-gray-900">
                Skip for now
              </Button>
              <Button
                onClick={handleNext}
                disabled={!country || !city || !timezone || !primaryLanguage}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center space-x-2"
              >
                <span>Complete Setup</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
