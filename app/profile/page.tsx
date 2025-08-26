"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  Star, 
  DollarSign,
  Briefcase,
  GraduationCap,
  Award,
  ExternalLink,
  Github,
  Linkedin,
  Clock,
  Languages as LanguagesIcon,
  Camera,
  Plus,
  Trash2,
  Building2,
  CheckCircle,
  Users,
  TrendingUp,
  Loader2
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import ImageUpload from "@/components/ui/image-upload"
import PhoneInput from "@/components/ui/phone-input"
import { allCountries, type Country } from "@/lib/countries"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { 
  useGetUserProfileQuery, 
  useUpdateUserProfileMutation,
  useUpdateUserSkillsMutation,
  useUpdateUserEducationMutation,
  useUpdateUserEmploymentMutation,
  useUpdateUserPortfolioMutation,
  useUpdateUserLocationAndProfileMutation
} from "@/lib/redux/api/firebaseApi"
import type { 
  User as FirebaseUser, 
  UserSkill, 
  UserEducation, 
  UserEmployment, 
  UserPortfolio 
} from "@/lib/redux/types/firebaseTypes"

const skillsList = [
  "React", "Vue.js", "Angular", "Node.js", "Python", "Java", "PHP", "Ruby",
  "iOS", "Android", "Flutter", "React Native", "Swift", "Kotlin",
  "Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator",
  "SEO", "Google Ads", "Facebook Ads", "Content Marketing", "Email Marketing",
  "WordPress", "Shopify", "Magento", "WooCommerce",
  "AWS", "Docker", "Kubernetes", "CI/CD", "DevOps"
]

const languageLevels = [
  "Native", "Fluent", "Conversational", "Basic"
]

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [showImageUpload, setShowImageUpload] = useState(false)

  // Firebase hooks
  const { 
    data: profileData, 
    isLoading: isLoadingProfile, 
    error: profileError,
    refetch: refetchProfile 
  } = useGetUserProfileQuery(user?.userId || '', {
    skip: !user?.userId
  })

  const [updateUserProfile, { isLoading: isUpdatingProfile }] = useUpdateUserProfileMutation()
  const [updateUserSkills] = useUpdateUserSkillsMutation()
  const [updateUserEducation] = useUpdateUserEducationMutation()
  const [updateUserEmployment] = useUpdateUserEmploymentMutation()
  const [updateUserPortfolio] = useUpdateUserPortfolioMutation()
  const [updateUserLocationAndProfile] = useUpdateUserLocationAndProfileMutation()

  // Local state for form data
  const [formData, setFormData] = useState<Partial<FirebaseUser>>({})

  // Initialize form data when profile data loads
  useEffect(() => {
    if (profileData) {
      setFormData({
        ...profileData,
        // Handle nested objects with proper defaults
        about: {
          streetAddress: profileData.about?.streetAddress || '',
          city: profileData.about?.city || '',
          state: profileData.about?.state || '',
          country: profileData.about?.country || '',
          zipCode: profileData.about?.zipCode || '',
          tel: profileData.about?.tel || '',
          dob: profileData.about?.dob || '',
          profileUrl: profileData.about?.profileUrl || '',
          downloadLink: profileData.about?.downloadLink || '',
          websiteUrl: profileData.about?.websiteUrl || '',
          linkedinUrl: profileData.about?.linkedinUrl || '',
          githubUrl: profileData.about?.githubUrl || '',
          primaryLanguage: profileData.about?.primaryLanguage || '',
          additionalLanguages: profileData.about?.additionalLanguages || [],
        },
        skills: profileData.skills || [],
        education: profileData.education || [],
        employment: profileData.employment || [],
        portfolio: profileData.portfolio || [],
      })
    }
  }, [profileData])

  const handleSave = async () => {
    if (!user?.userId) return

    try {
      // Update basic profile information
      await updateUserProfile({
        userId: user.userId,
        profileData: {
          firstname: formData.firstname,
          lastname: formData.lastname,
          displayName: formData.displayName,
          title: formData.title,
          overview: formData.overview,
          hourRate: formData.hourRate,
          photoURL: formData.photoURL,
          about: formData.about,
        }
      }).unwrap()

      // Update skills if changed
      if (formData.skills && JSON.stringify(formData.skills) !== JSON.stringify(profileData?.skills)) {
        await updateUserSkills({
          userId: user.userId,
          skills: formData.skills
        }).unwrap()
      }

      // Update education if changed
      if (formData.education && JSON.stringify(formData.education) !== JSON.stringify(profileData?.education)) {
        await updateUserEducation({
          userId: user.userId,
          education: formData.education
        }).unwrap()
      }

      // Update employment if changed
      if (formData.employment && JSON.stringify(formData.employment) !== JSON.stringify(profileData?.employment)) {
        await updateUserEmployment({
          userId: user.userId,
          employment: formData.employment
        }).unwrap()
      }

      // Update portfolio if changed
      if (formData.portfolio && JSON.stringify(formData.portfolio) !== JSON.stringify(profileData?.portfolio)) {
        await updateUserPortfolio({
          userId: user.userId,
          portfolio: formData.portfolio
        }).unwrap()
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully."
      })
      
      setIsEditing(false)
      refetchProfile()
    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save profile. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev] as any,
        [field]: value
      }
    }))
  }

  const addSkill = (skillText: string) => {
    const currentSkills = formData.skills || []
    const skillExists = currentSkills.some(skill => skill.text === skillText)
    
    if (!skillExists) {
      const newSkill: UserSkill = {
        id: Date.now().toString(),
        text: skillText,
        level: 'intermediate',
        yearsOfExperience: 1
      }
      
      setFormData(prev => ({
        ...prev,
        skills: [...currentSkills, newSkill]
      }))
    }
  }

  const removeSkill = (skillId: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter(s => s.id !== skillId) || []
    }))
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Please Log In</h2>
            <p className="text-gray-600">You need to be logged in to view your profile.</p>
          </div>
        </div>
      </div>
    )
  }

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 mx-auto mb-4 text-primary-blue animate-spin" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Loading Profile</h2>
            <p className="text-gray-600">Please wait while we load your profile data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (profileError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Error Loading Profile</h2>
            <p className="text-gray-600 mb-4">We couldn't load your profile data.</p>
            <Button onClick={() => refetchProfile()}>Try Again</Button>
          </div>
        </div>
      </div>
    )
  }

  const rawDisplayData = isEditing ? formData : profileData
  if (!rawDisplayData) return null

  // Cast to extended type for additional properties
  const displayData = rawDisplayData as FirebaseUser

  // Combine languages from primaryLanguage and additionalLanguages in about object
  const getAllLanguages = () => {
    const languages = []
    
    // Add primary language from about object
    if (displayData.about?.primaryLanguage && displayData.about.primaryLanguage.trim()) {
      languages.push({
        language: displayData.about.primaryLanguage.trim(),
        proficiency: 'Native'
      })
    }
    
    // Add additional languages from about object
    if (displayData.about?.additionalLanguages && Array.isArray(displayData.about.additionalLanguages)) {
      displayData.about.additionalLanguages.forEach((lang: any) => {
        // Handle both string format ['French', 'German'] and object format [{language: 'French', proficiency: 'Basic'}]
        if (typeof lang === 'string' && lang.trim()) {
          // Database stores simple string array
          languages.push({
            language: lang.trim(),
            proficiency: 'Basic' // Default proficiency for string format
          })
        } else if (lang && typeof lang === 'object' && lang.language && typeof lang.language === 'string' && lang.language.trim()) {
          // Database stores object array format
          languages.push({
            language: lang.language.trim(),
            proficiency: lang.proficiency || 'Basic'
          })
        }
      })
    }
    
    // Remove duplicates based on language name (case-insensitive)
    const uniqueLanguages = languages.filter((lang, index, arr) => 
      lang && 
      typeof lang.language === "string" && 
      lang.language.trim() &&
      arr.findIndex(l => l && 
                        typeof l.language === "string" && 
                        l.language.trim().toLowerCase() === lang.language.trim().toLowerCase()) === index
    )
    
    return uniqueLanguages
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-primary-blue to-primary-green"></div>
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
              {/* Profile Image */}
              <div className="relative -mt-16 sm:-mt-12">
                <div className="relative">
                  <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white shadow-lg">
                    <AvatarImage src={displayData.photoURL} alt={displayData.displayName} />
                    <AvatarFallback className="text-2xl bg-blue-100 text-primary-blue">
                      {displayData.firstname?.[0]}{displayData.lastname?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-1 -right-1 rounded-full w-8 h-8 p-0"
                      onClick={() => setShowImageUpload(true)}
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Basic Info */}
              <div className="flex-1 mt-4 sm:mt-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {displayData.displayName}
                    </h1>
                    <p className="text-lg text-primary-blue font-medium mt-1">
                      {displayData.title}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {displayData.about?.city}, {displayData.about?.country}
                      </div>
                      {user.role && (
                        <Badge variant={user.role === 'freelancer' ? 'default' : 'secondary'}>
                          {user.role === 'freelancer' ? 'Freelancer' : 'Client'}
                        </Badge>
                      )}
                      {user.isVerified && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current mr-1" />
                        <span className="font-medium">{displayData.stats?.averageRating?.toFixed(1) || '0.0'}</span>
                        <span className="text-gray-600 ml-1">({displayData.stats?.totalReviews || 0} reviews)</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-4 sm:mt-0 flex space-x-3">
                    {isEditing ? (
                      <>
                        <Button 
                          onClick={handleSave} 
                          disabled={isUpdatingProfile}
                          className="bg-primary-green hover:bg-primary-green/90"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {isUpdatingProfile ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button 
                        onClick={() => setIsEditing(true)}
                        className="bg-primary-blue hover:bg-primary-blue/90"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Stats for Freelancers */}
            {user.role === 'freelancer' && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6 pt-6 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {displayData.stats?.completedJobs || 0}
                  </div>
                  <div className="text-sm text-gray-600">Jobs Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    ${((displayData.stats?.totalEarnings || 0) / 1000).toFixed(0)}K
                  </div>
                  <div className="text-sm text-gray-600">Total Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {displayData.stats?.responseRate || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Response Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {displayData.stats?.onTimeDelivery || 0}%
                  </div>
                  <div className="text-sm text-gray-600">On Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {displayData.stats?.repeatClients || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Repeat Clients</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <Label>Email</Label>
                      <Input
                        value={displayData.email || ''}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Email"
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={displayData.about?.tel || ''}
                        onChange={(e) => handleNestedInputChange("about", "tel", e.target.value)}
                        placeholder="Phone number"
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={displayData.about?.city || ''}
                          onChange={(e) => handleNestedInputChange("about", "city", e.target.value)}
                          placeholder="City"
                        />
                        <Input
                          value={displayData.about?.country || ''}
                          onChange={(e) => handleNestedInputChange("about", "country", e.target.value)}
                          placeholder="Country"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{displayData.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{displayData.about?.tel}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{displayData.about?.city}, {displayData.about?.country}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Professional Links */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Professional Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <Label>Website</Label>
                      <Input
                        value={displayData.about?.websiteUrl || ''}
                        onChange={(e) => handleNestedInputChange("about", "websiteUrl", e.target.value)}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div>
                      <Label>LinkedIn</Label>
                      <Input
                        value={displayData.about?.linkedinUrl || ''}
                        onChange={(e) => handleNestedInputChange("about", "linkedinUrl", e.target.value)}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                    <div>
                      <Label>GitHub</Label>
                      <Input
                        value={displayData.about?.githubUrl || ''}
                        onChange={(e) => handleNestedInputChange("about", "githubUrl", e.target.value)}
                        placeholder="https://github.com/yourusername"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {displayData.about?.websiteUrl && (
                      <div className="flex items-center space-x-3">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <a href={displayData.about.websiteUrl} target="_blank" rel="noopener noreferrer" 
                           className="text-sm text-primary-blue hover:underline">
                          Website
                        </a>
                      </div>
                    )}
                    {displayData.about?.linkedinUrl && (
                      <div className="flex items-center space-x-3">
                        <Linkedin className="w-4 h-4 text-gray-400" />
                        <a href={displayData.about.linkedinUrl} target="_blank" rel="noopener noreferrer" 
                           className="text-sm text-primary-blue hover:underline">
                          LinkedIn
                        </a>
                      </div>
                    )}
                    {displayData.about?.githubUrl && (
                      <div className="flex items-center space-x-3">
                        <Github className="w-4 h-4 text-gray-400" />
                        <a href={displayData.about.githubUrl} target="_blank" rel="noopener noreferrer" 
                           className="text-sm text-primary-blue hover:underline">
                          GitHub
                        </a>
                      </div>
                    )}
                    {!displayData.about?.websiteUrl && !displayData.about?.linkedinUrl && !displayData.about?.githubUrl && (
                      <p className="text-sm text-gray-500">No professional links added yet.</p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Hourly Rate for Freelancers */}
            {user.role === 'freelancer' && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Hourly Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={displayData.hourRate || ''}
                        onChange={(e) => handleInputChange("hourRate", e.target.value)}
                        placeholder="85"
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600">/hour</span>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-primary-green">
                      {displayData.hourRate || '0'}/hour
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Bio */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div>
                        <Label>Professional Summary</Label>
                        <Textarea
                          value={displayData.overview || ''}
                          onChange={(e) => handleInputChange("overview", e.target.value)}
                          placeholder="Tell clients about yourself, your experience, and what makes you unique..."
                          rows={6}
                          className="mt-2"
                        />
                      </div>
                    ) : (
                      <p className="text-gray-700 leading-relaxed">{displayData.overview}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Languages */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <LanguagesIcon className="w-5 h-5 mr-2" />
                        Languages
                      </CardTitle>
                      {isEditing && (
                        <Button size="sm" onClick={() => {
                          const newLanguage = { language: '', proficiency: 'Basic' }
                          const updatedLanguages = [...(displayData.about?.additionalLanguages || []), newLanguage]
                          handleNestedInputChange("about", "additionalLanguages", updatedLanguages)
                        }}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Language
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-4">
                        {/* Primary Language */}
                        <div>
                          <Label className="text-sm font-medium">Primary Language</Label>
                          <Input
                            value={displayData.about?.primaryLanguage || ''}
                            onChange={(e) => handleNestedInputChange("about", "primaryLanguage", e.target.value)}
                            placeholder="Enter your primary language"
                            className="mt-1"
                          />
                        </div>
                        
                        {/* Additional Languages */}
                        <div>
                          <Label className="text-sm font-medium">Additional Languages</Label>
                          <div className="space-y-2 mt-2">
                            {(displayData.about?.additionalLanguages || []).map((lang: any, index: number) => (
                              <div key={index} className="flex items-center space-x-2">
                                <Input
                                  value={lang.language || ''}
                                  onChange={(e) => {
                                    const updatedLanguages = [...(displayData.about?.additionalLanguages || [])]
                                    updatedLanguages[index] = { ...lang, language: e.target.value }
                                    handleNestedInputChange("about", "additionalLanguages", updatedLanguages)
                                  }}
                                  placeholder="Language"
                                  className="flex-1"
                                />
                                <Select
                                  value={lang.proficiency || 'Basic'}
                                  onValueChange={(value) => {
                                    const updatedLanguages = [...(displayData.about?.additionalLanguages || [])]
                                    updatedLanguages[index] = { ...lang, proficiency: value }
                                    handleNestedInputChange("about", "additionalLanguages", updatedLanguages)
                                  }}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {languageLevels.map(level => (
                                      <SelectItem key={level} value={level}>{level}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => {
                                    const updatedLanguages = (displayData.about?.additionalLanguages || []).filter((_, i) => i !== index)
                                    handleNestedInputChange("about", "additionalLanguages", updatedLanguages)
                                  }}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {(() => {
                          const allLanguages = getAllLanguages()
                          return allLanguages.length > 0 ? (
                            allLanguages.map((lang: any, index: number) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="font-medium">{lang.language}</span>
                                <Badge variant="secondary">{lang.proficiency}</Badge>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">No languages added yet.</p>
                          )
                        })()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience" className="space-y-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Briefcase className="w-5 h-5 mr-2" />
                        Work Experience
                      </CardTitle>
                      {isEditing && (
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Experience
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {(displayData.employment || []).map((emp: any, index: number) => (
                        <div key={emp.id || index} className="border-l-2 border-primary-blue/30 pl-4 relative">
                          <div className="absolute w-3 h-3 bg-primary-blue rounded-full -left-2 top-2"></div>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">{emp.title}</h3>
                              <p className="text-primary-blue font-medium">{emp.company}</p>
                              <p className="text-sm text-gray-600">{emp.location}</p>
                            </div>
                            <div className="text-right text-sm text-gray-500">
                              {emp.startDate} - {emp.current ? "Present" : emp.endDate}
                              {emp.current && (
                                <Badge variant="outline" className="ml-2 text-green-600 border-green-600">
                                  Current
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm">{emp.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education" className="space-y-6">
                {/* Education */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <GraduationCap className="w-5 h-5 mr-2" />
                        Education
                      </CardTitle>
                      {isEditing && (
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Education
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(displayData.education || []).map((edu: any, index: number) => (
                        <div key={edu.id || index} className="border-l-2 border-primary-green/30 pl-4">
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                              <p className="text-primary-green font-medium">{edu.school}</p>
                              <p className="text-sm text-gray-600">{edu.location}</p>
                            </div>
                            <span className="text-sm text-gray-500">{edu.endDate}</span>
                          </div>
                          <p className="text-sm text-gray-700">{edu.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Certifications */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Award className="w-5 h-5 mr-2" />
                        Certifications
                      </CardTitle>
                      {isEditing && (
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Certification
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(displayData.certifications || []).map((cert: any, index: number) => (
                        <div key={cert.id || index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                            <span className="text-sm text-gray-500">{cert.issueDate}</span>
                          </div>
                          <p className="text-primary-blue font-medium mb-1">{cert.issuer}</p>
                          <p className="text-xs text-gray-500 mb-2">
                            Credential ID: {cert.credentialId}
                            {cert.expirationDate && ` • Expires: ${cert.expirationDate}`}
                          </p>
                          {cert.credentialUrl && (
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-primary-blue hover:underline"
                            >
                              View Credential
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="portfolio" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Portfolio</h2>
                  {isEditing && (
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(displayData.portfolio && displayData.portfolio.length > 0) ? (
                    displayData.portfolio.map((project: any, index: number) => (
                      <Card key={project.id || index} className="shadow-lg overflow-hidden">
                        <div className="aspect-video relative bg-gray-200">
                          {(project.image || project.imageLink) ? (
                            <Image
                              src={project.image || project.imageLink}
                              alt={project.title}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                // Fallback to placeholder if image fails to load
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <span className="text-gray-400">No image</span>
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary">{project.category}</Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {(project.technologies || project.skills || []).map((tech: any, techIndex: number) => (
                              <Badge key={techIndex} variant="outline" className="text-xs">
                                {typeof tech === 'string' ? tech : tech.text}
                              </Badge>
                            ))}
                          </div>
                          {(project.projectUrl || project.url || project.link) && (
                            <a
                              href={project.projectUrl || project.url || project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-primary-blue hover:underline cursor-pointer transition-colors hover:text-primary-blue/80"
                            >
                              View Project
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-500">No portfolio projects added yet.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="skills" className="space-y-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Skills & Expertise</CardTitle>
                      {isEditing && (
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Skill
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(displayData.skills || []).map((skill: any, index: number) => (
                          <div key={skill.id || index} className="relative">
                            <Badge
                              variant="secondary"
                              className="pr-8 bg-blue-100 text-primary-blue hover:bg-blue-200"
                            >
                              {skill.text || skill}
                              {isEditing && (
                                <button
                                  onClick={() => removeSkill(skill.id || skill)}
                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                  <X className="w-2 h-2" />
                                </button>
                              )}
                            </Badge>
                          </div>
                        ))}
                      </div>
                      {isEditing && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Add Skills</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {skillsList
                              .filter((skill) => !(displayData.skills || []).some((s: any) => 
                                (s.text || s) === skill
                              ))
                              .slice(0, 12)
                              .map((skill) => (
                                <Button
                                  key={skill}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addSkill(skill)}
                                  className="justify-start text-sm"
                                >
                                  + {skill}
                                </Button>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Image Upload Modal */}
        {showImageUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Upload Profile Photo</h3>
              <ImageUpload
                value={displayData.photoURL || ''}
                onChange={(url: string) => {
                  handleInputChange("photoURL", url)
                  setShowImageUpload(false)
                }}
                onError={(error) => {
                  toast({
                    title: "Upload Failed",
                    description: error,
                    variant: "destructive"
                  })
                }}
              />
              <div className="flex justify-end space-x-3 mt-4">
                <Button variant="outline" onClick={() => setShowImageUpload(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
