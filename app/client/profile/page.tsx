"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
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
  Building2,
  Award,
  ExternalLink,
  Clock,
  Camera,
  CheckCircle,
  Users,
  TrendingUp,
  Loader2,
  CreditCard,
  Shield,
  Activity,
  FileText,
  AlertCircle,
  Crown,
  Zap
} from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/redux/store"
import { useToast } from "@/hooks/use-toast"
import ImageUpload from "@/components/ui/image-upload"
import { allCountries, type Country } from "@/lib/countries"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  useGetUserProfileQuery, 
  useUpdateUserProfileMutation,
  useUpdateUserLocationAndProfileMutation,
  useGetProjectsByClientQuery
} from "@/lib/redux/api/firebaseApi"
import type { User as FirebaseUser, Project } from "@/lib/redux/types/firebaseTypes"

const industryOptions = [
  "Technology", "Healthcare", "Finance", "Education", "Retail", "Manufacturing",
  "Real Estate", "Marketing & Advertising", "Consulting", "Non-profit", "Government",
  "Entertainment", "Food & Beverage", "Transportation", "Energy", "Other"
]

const companySizeOptions = [
  "1-10 employees", "11-50 employees", "51-200 employees", 
  "201-500 employees", "501-1000 employees", "1000+ employees"
]

// Helper function to get status badge color and text
const getProjectStatusInfo = (status: string) => {
  switch (status) {
    case 'draft':
      return { color: 'bg-gray-100 text-gray-800 border-gray-200', text: 'Draft' }
    case 'active':
      return { color: 'bg-blue-100 text-blue-800 border-blue-200', text: 'Active' }
    case 'in_progress':
      return { color: 'bg-orange-100 text-orange-800 border-orange-200', text: 'In Progress' }
    case 'completed':
      return { color: 'bg-green-100 text-green-800 border-green-200', text: 'Completed' }
    case 'cancelled':
      return { color: 'bg-red-100 text-red-800 border-red-200', text: 'Cancelled' }
    default:
      return { color: 'bg-gray-100 text-gray-800 border-gray-200', text: status }
  }
}

// Helper function to format currency
const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

// Helper function to format date
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return 'N/A'
  }
}

export default function ClientProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth)
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
  const [updateUserLocationAndProfile] = useUpdateUserLocationAndProfileMutation()

  // Projects query
  const { 
    data: clientProjects, 
    isLoading: isLoadingProjects, 
    error: projectsError,
    refetch: refetchProjects 
  } = useGetProjectsByClientQuery({
    clientId: user?.userId || '',
    limit: 50
  }, {
    skip: !user?.userId
  })

  // Local state for form data
  const [formData, setFormData] = useState<Partial<FirebaseUser>>({})

  // Initialize form data when profile data loads
  useEffect(() => {
    if (profileData) {
      setFormData({
        ...profileData,
        about: {
          ...profileData.about,
          streetAddress: profileData.about?.streetAddress || '',
          city: profileData.about?.city || '',
          state: profileData.about?.state || '',
          country: profileData.about?.country || '',
          zipCode: profileData.about?.zipCode || '',
          tel: profileData.about?.tel || '',
          dob: profileData.about?.dob || '',
          bio: profileData.about?.bio || '',
          websiteUrl: profileData.about?.websiteUrl || '',
          linkedinUrl: profileData.about?.linkedinUrl || '',
          timezone: profileData.about?.timezone || '',
          primaryLanguage: profileData.about?.primaryLanguage || '',
        },
      })
    }
  }, [profileData])

  // Calculate profile completeness for clients
  const calculateProfileCompleteness = () => {
    if (!profileData) return 0
    
    let completedFields = 0
    const totalFields = 17 // Updated total important fields for client profile
    
    // Basic information (5 fields)
    if (profileData.firstname) completedFields++
    if (profileData.lastname) completedFields++
    if (profileData.title) completedFields++
    if (profileData.overview) completedFields++
    if (profileData.photoURL) completedFields++
    
    // Contact information (4 fields)
    if (profileData.email) completedFields++
    if (profileData.about?.tel) completedFields++
    if (profileData.about?.city) completedFields++
    if (profileData.about?.country) completedFields++
    
    // Company information (3 fields)
    if (profileData.about?.companyName) completedFields++
    if (profileData.about?.industry) completedFields++
    if (profileData.about?.companySize) completedFields++
    
    // Additional information (3 fields)
    if (profileData.about?.websiteUrl) completedFields++
    if (profileData.about?.linkedinUrl) completedFields++
    if (profileData.isVerified) completedFields++
    
    // Verification status (2 fields) - these show trustworthiness
    if (profileData.emailVerified) completedFields++
    if (profileData.paymentVerified) completedFields++
    
    return Math.round((completedFields / totalFields) * 100)
  }

  const profileCompleteness = calculateProfileCompleteness()

  const displayData = formData.userId ? formData : (profileData || {})

  const handleSave = async () => {
    if (!user?.userId) return

    try {
      await updateUserProfile({
        userId: user.userId,
        profileData: {
          firstname: formData.firstname,
          lastname: formData.lastname,
          displayName: formData.displayName,
          title: formData.title,
          overview: formData.overview,
          photoURL: formData.photoURL,
          about: formData.about,
        }
      }).unwrap()

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

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="relative">
            {/* Cover/Banner Section */}
            <div className="h-32 bg-gradient-to-r from-primary-blue to-primary-green rounded-t-lg"></div>
            
            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
                {/* Profile Photo */}
                <div className="relative -mt-16 mb-4 sm:mb-0">
                  <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                      <AvatarImage src={displayData.photoURL} alt={displayData.displayName} className="object-cover" />
                      <AvatarFallback className="text-2xl bg-gray-200">
                        {displayData.firstname?.[0]}{displayData.lastname?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <button
                        onClick={() => setShowImageUpload(true)}
                        className="absolute bottom-0 right-0 bg-primary-blue text-white rounded-full p-2 shadow-lg hover:bg-primary-blue-dark transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h1 className="text-2xl font-bold text-gray-900">
                          {displayData.displayName || `${displayData.firstname} ${displayData.lastname}`}
                        </h1>
                        {displayData.isVerified && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified Client
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        {displayData.title && (
                          <p className="text-lg text-gray-600">{displayData.title}</p>
                        )}
                        {displayData.about?.companyName && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            <Building2 className="w-3 h-3 mr-1" />
                            {displayData.about.companyName}
                          </Badge>
                        )}
                        {displayData.about?.city && displayData.about?.country && (
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{displayData.about.city}, {displayData.about.country}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-yellow-500">
                          <Star className="w-4 h-4 fill-current mr-1" />
                          <span className="font-medium">{displayData.stats?.averageRating?.toFixed(1) || '0.0'}</span>
                          <span className="text-gray-600 ml-1">({displayData.stats?.totalReviews || 0} reviews)</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{displayData.stats?.totalJobs || 0} projects posted</span>
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
                            className="bg-primary-blue hover:bg-primary-blue-dark text-white transition-colors"
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
                        <>
                          <Button 
                            onClick={() => setIsEditing(true)}
                            className="bg-primary-blue hover:bg-primary-blue-dark text-white transition-colors"
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Profile
                          </Button>
                          <Link href={`/profile/${user?.userId}`} target="_blank">
                            <Button variant="outline">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Public Profile
                            </Button>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Client Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 pb-6 border-t">
              <div className="text-center py-4">
                <div className="text-2xl font-bold text-gray-900">
                  {displayData.stats?.totalJobs || 0}
                </div>
                <div className="text-sm text-gray-600">Projects Posted</div>
              </div>
              <div className="text-center py-4">
                <div className="text-2xl font-bold text-gray-900">
                  ${((displayData.stats?.totalSpent || 0) / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>
              <div className="text-center py-4">
                <div className="text-2xl font-bold text-gray-900">
                  {displayData.stats?.activeProjects || 0}
                </div>
                <div className="text-sm text-gray-600">Active Projects</div>
              </div>
              <div className="text-center py-4">
                <div className="text-2xl font-bold text-gray-900">
                  {displayData.stats?.hirRate || 0}%
                </div>
                <div className="text-sm text-gray-600">Hire Rate</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completeness */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Profile Completeness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{profileCompleteness}% Complete</span>
                    <Badge variant={profileCompleteness >= 80 ? "default" : "secondary"}>
                      {profileCompleteness >= 80 ? "Strong" : "Needs Work"}
                    </Badge>
                  </div>
                  <Progress value={profileCompleteness} className="h-2" />
                  
                  {profileCompleteness < 100 && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Complete these to improve your profile:</p>
                      <div className="space-y-1">
                        {!displayData.photoURL && (
                          <div className="flex items-center text-sm text-amber-600">
                            <AlertCircle className="w-3 h-3 mr-2" />
                            Add profile photo
                          </div>
                        )}
                        {!displayData.title && (
                          <div className="flex items-center text-sm text-amber-600">
                            <AlertCircle className="w-3 h-3 mr-2" />
                            Add professional title
                          </div>
                        )}
                        {!displayData.overview && (
                          <div className="flex items-center text-sm text-amber-600">
                            <AlertCircle className="w-3 h-3 mr-2" />
                            Write profile summary
                          </div>
                        )}
                        {!displayData.about?.companyName && (
                          <div className="flex items-center text-sm text-amber-600">
                            <AlertCircle className="w-3 h-3 mr-2" />
                            Add company information
                          </div>
                        )}
                        {!displayData.emailVerified && (
                          <div className="flex items-center text-sm text-amber-600">
                            <AlertCircle className="w-3 h-3 mr-2" />
                            Verify your email address
                          </div>
                        )}
                        {!displayData.paymentVerified && (
                          <div className="flex items-center text-sm text-amber-600">
                            <AlertCircle className="w-3 h-3 mr-2" />
                            Verify payment method
                          </div>
                        )}
                        {!displayData.isVerified && (
                          <div className="flex items-center text-sm text-amber-600">
                            <AlertCircle className="w-3 h-3 mr-2" />
                            Complete identity verification
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Trust & Safety */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Trust & Safety
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className={`w-4 h-4 mr-2 ${displayData.emailVerified ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className="text-sm">Email Verified</span>
                    </div>
                    {displayData.emailVerified ? (
                      <Badge variant="outline" className="text-green-600 border-green-200">✓</Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-400 border-gray-200">-</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className={`w-4 h-4 mr-2 ${displayData.phoneVerified ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className="text-sm">Phone Verified</span>
                    </div>
                    {displayData.phoneVerified ? (
                      <Badge variant="outline" className="text-green-600 border-green-200">✓</Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-400 border-gray-200">-</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className={`w-4 h-4 mr-2 ${displayData.paymentVerified ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className="text-sm">Payment Verified</span>
                    </div>
                    {displayData.paymentVerified ? (
                      <Badge variant="outline" className="text-green-600 border-green-200">✓</Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-400 border-gray-200">-</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className={`w-4 h-4 mr-2 ${displayData.isVerified ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className="text-sm">Identity Verified</span>
                    </div>
                    {displayData.isVerified ? (
                      <Badge variant="outline" className="text-green-600 border-green-200">✓</Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-400 border-gray-200">-</Badge>
                    )}
                  </div>
                </div>
                
                {/* Show verification prompt only if some verifications are missing */}
                {(!displayData.emailVerified || !displayData.phoneVerified || !displayData.paymentVerified || !displayData.isVerified) && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-3">
                      Complete verification to build trust with freelancers
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Shield className="w-4 h-4 mr-2" />
                      Complete Verification
                    </Button>
                  </div>
                )}
                
                {/* Show completion message if all verifications are done */}
                {(displayData.emailVerified && displayData.phoneVerified && displayData.paymentVerified && displayData.isVerified) && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">All verifications completed</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

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
                      <Label>City</Label>
                      <Input
                        value={displayData.about?.city || ''}
                        onChange={(e) => handleNestedInputChange("about", "city", e.target.value)}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label>Country</Label>
                      <Select
                        value={displayData.about?.country || ''}
                        onValueChange={(value) => handleNestedInputChange("about", "country", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {allCountries.map((country) => (
                            <SelectItem key={country.code} value={country.name}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{displayData.email}</span>
                    </div>
                    {displayData.about?.tel && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{displayData.about.tel}</span>
                      </div>
                    )}
                    {(displayData.about?.city || displayData.about?.country) && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {displayData.about?.city && displayData.about?.country 
                            ? `${displayData.about.city}, ${displayData.about.country}`
                            : displayData.about?.city || displayData.about?.country
                          }
                        </span>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Company Links */}
            {(displayData.about?.websiteUrl || displayData.about?.linkedinUrl || isEditing) && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Company Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <Label>Company Website</Label>
                        <Input
                          value={displayData.about?.websiteUrl || ''}
                          onChange={(e) => handleNestedInputChange("about", "websiteUrl", e.target.value)}
                          placeholder="https://yourcompany.com"
                        />
                      </div>
                      <div>
                        <Label>LinkedIn</Label>
                        <Input
                          value={displayData.about?.linkedinUrl || ''}
                          onChange={(e) => handleNestedInputChange("about", "linkedinUrl", e.target.value)}
                          placeholder="https://linkedin.com/company/yourcompany"
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
                            Company Website
                          </a>
                        </div>
                      )}
                      {displayData.about?.linkedinUrl && (
                        <div className="flex items-center space-x-3">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <a href={displayData.about.linkedinUrl} target="_blank" rel="noopener noreferrer" 
                             className="text-sm text-primary-blue hover:underline">
                            LinkedIn Profile
                          </a>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="company">Company Info</TabsTrigger>
                <TabsTrigger value="projects">Project History</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* About Section */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label>Professional Title</Label>
                          <Input
                            value={displayData.title || ''}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            placeholder="e.g., Product Manager at TechCorp"
                          />
                        </div>
                        <div>
                          <Label>Profile Summary</Label>
                          <Textarea
                            value={displayData.overview || ''}
                            onChange={(e) => handleInputChange("overview", e.target.value)}
                            placeholder="Tell freelancers about yourself, your company, and what kind of projects you typically post..."
                            rows={6}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {displayData.title && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Title</h4>
                            <p className="text-gray-700">{displayData.title}</p>
                          </div>
                        )}
                        {displayData.overview && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                            <p className="text-gray-700 leading-relaxed">{displayData.overview}</p>
                          </div>
                        )}
                        {(!displayData.title && !displayData.overview) && (
                          <p className="text-gray-500 italic">
                            Add a title and summary to help freelancers understand your background and project needs.
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-sm">No recent activity to display</p>
                      <p className="text-xs mt-1">Activity will appear here as you interact with the platform</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="company" className="space-y-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building2 className="w-5 h-5 mr-2" />
                      Company Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label>Company Name</Label>
                          <Input
                            value={displayData.about?.companyName || ''}
                            onChange={(e) => handleNestedInputChange("about", "companyName", e.target.value)}
                            placeholder="Your company name"
                          />
                        </div>
                        <div>
                          <Label>Industry</Label>
                          <Select
                            value={displayData.about?.industry || ''}
                            onValueChange={(value) => handleNestedInputChange("about", "industry", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              {industryOptions.map((industry) => (
                                <SelectItem key={industry} value={industry}>
                                  {industry}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Company Size</Label>
                          <Select
                            value={displayData.about?.companySize || ''}
                            onValueChange={(value) => handleNestedInputChange("about", "companySize", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select company size" />
                            </SelectTrigger>
                            <SelectContent>
                              {companySizeOptions.map((size) => (
                                <SelectItem key={size} value={size}>
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Company Description</Label>
                          <Textarea
                            value={displayData.about?.companyDescription || ''}
                            onChange={(e) => handleNestedInputChange("about", "companyDescription", e.target.value)}
                            placeholder="Brief description of your company and what you do..."
                            rows={4}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {displayData.about?.companyName && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Company</h4>
                            <p className="text-gray-700">{displayData.about.companyName}</p>
                          </div>
                        )}
                        {displayData.about?.industry && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Industry</h4>
                            <p className="text-gray-700">{displayData.about.industry}</p>
                          </div>
                        )}
                        {displayData.about?.companySize && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Company Size</h4>
                            <p className="text-gray-700">{displayData.about.companySize}</p>
                          </div>
                        )}
                        {displayData.about?.companyDescription && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">About the Company</h4>
                            <p className="text-gray-700 leading-relaxed">{displayData.about.companyDescription}</p>
                          </div>
                        )}
                        {(!displayData.about?.companyName && !displayData.about?.industry) && (
                          <p className="text-gray-500 italic">
                            Add company information to help freelancers understand your business better.
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects" className="space-y-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Project History
                      </div>
                      {clientProjects && clientProjects.length > 0 && (
                        <Badge variant="secondary">
                          {clientProjects.length} Project{clientProjects.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingProjects ? (
                      <div className="text-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-blue" />
                        <p className="text-sm text-gray-600">Loading projects...</p>
                      </div>
                    ) : projectsError ? (
                      <div className="text-center py-8 text-red-500">
                        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-300" />
                        <p className="text-sm">Failed to load projects</p>
                        <Button 
                          variant="outline" 
                          onClick={() => refetchProjects()} 
                          className="mt-3"
                        >
                          Try Again
                        </Button>
                      </div>
                    ) : !clientProjects || clientProjects.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-sm">No projects posted yet</p>
                        <p className="text-xs mt-1">Your posted projects and their status will be displayed here</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Project Statistics */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                              {clientProjects.filter(p => p.status === 'active').length}
                            </div>
                            <div className="text-xs text-gray-600">Active</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                              {clientProjects.filter(p => p.status === 'in_progress').length}
                            </div>
                            <div className="text-xs text-gray-600">In Progress</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                              {clientProjects.filter(p => p.status === 'completed').length}
                            </div>
                            <div className="text-xs text-gray-600">Completed</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                              {clientProjects.reduce((sum, p) => sum + (p.proposalCount || 0), 0)}
                            </div>
                            <div className="text-xs text-gray-600">Total Proposals</div>
                          </div>
                        </div>
                        
                        {/* Project List */}
                        <div className="space-y-4">
                        {clientProjects.map((project) => {
                          const statusInfo = getProjectStatusInfo(project.status)
                          return (
                            <div 
                              key={project.projectId} 
                              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 mb-1">{project.title}</h3>
                                  <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                                </div>
                                <Badge variant="outline" className={`ml-4 ${statusInfo.color} border`}>
                                  {statusInfo.text}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Category:</span>
                                  <p className="font-medium">{project.category}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Budget:</span>
                                  <p className="font-medium">
                                    {project.budget.type === 'fixed' 
                                      ? formatCurrency(project.budget.amount, project.budget.currency)
                                      : `${formatCurrency(project.budget.amount, project.budget.currency)}/hr`
                                    }
                                  </p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Proposals:</span>
                                  <p className="font-medium">{project.proposalCount || 0}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Created:</span>
                                  <p className="font-medium">{formatDate(project.createdAt)}</p>
                                </div>
                              </div>
                              
                              {project.timeline && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Clock className="w-4 h-4 mr-1" />
                                    <span>
                                      Duration: {project.timeline.duration}
                                      {project.timeline.startDate && (
                                        <>
                                          {' • Starts: '}
                                          {formatDate(project.timeline.startDate)}
                                        </>
                                      )}
                                    </span>
                                  </div>
                                </div>
                              )}
                              
                              {project.hiredFreelancerId && project.status === 'in_progress' && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <div className="flex items-center text-sm text-green-700 bg-green-50 px-3 py-2 rounded-md">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Project awarded to freelancer
                                  </div>
                                </div>
                              )}
                              
                              {/* Project Actions */}
                              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  {project.visibility && (
                                    <div className="flex items-center">
                                      <Globe className="w-3 h-3 mr-1" />
                                      <span className="capitalize">{project.visibility}</span>
                                    </div>
                                  )}
                                  {project.milestones && project.milestones.length > 0 && (
                                    <div className="flex items-center">
                                      <Activity className="w-3 h-3 mr-1" />
                                      <span>{project.milestones.length} Milestone{project.milestones.length !== 1 ? 's' : ''}</span>
                                    </div>
                                  )}
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => window.open(`/client/projects/${project.projectId}`, '_blank')}
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  View Project
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                        </div>
                      </div>
                    )}
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
