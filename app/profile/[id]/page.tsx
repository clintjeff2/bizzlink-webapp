"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { 
  MapPin, 
  Globe, 
  Mail, 
  Star, 
  DollarSign,
  Briefcase,
  GraduationCap,
  Award,
  ExternalLink,
  Github,
  Linkedin,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  Calendar,
  Languages as LanguagesIcon,
  Building2,
  Verified,
  MessageSquare,
  Heart,
  Share2,
  Loader2,
  AlertCircle,
  ArrowLeft,
  PhoneCall,
  Video,
  FileText,
  Target,
  Zap,
  Crown,
  Shield
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useGetUserProfileQuery } from "@/lib/redux/api/firebaseApi"
import type { User as FirebaseUser } from "@/lib/redux/types/firebaseTypes"

// Helper functions
const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'Member since'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  } catch {
    return 'Member since'
  }
}

const getSkillBadgeColor = (index: number) => {
  const colors = [
    'bg-blue-100 text-blue-800 border-blue-200',
    'bg-green-100 text-green-800 border-green-200',
    'bg-purple-100 text-purple-800 border-purple-200',
    'bg-orange-100 text-orange-800 border-orange-200',
    'bg-pink-100 text-pink-800 border-pink-200',
    'bg-indigo-100 text-indigo-800 border-indigo-200',
  ]
  return colors[index % colors.length]
}

export default function PublicProfilePage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  
  const { 
    data: profileData, 
    isLoading, 
    error 
  } = useGetUserProfileQuery(userId, {
    skip: !userId
  })

  const [isLiked, setIsLiked] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary-blue" />
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
            <p className="text-gray-600 mb-6">This profile doesn't exist or has been removed.</p>
            <Button onClick={() => router.push('/')} className="bg-primary-blue hover:bg-primary-blue-dark">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const isFreelancer = profileData.role === 'freelancer'
  const isClient = profileData.role === 'client'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-blue to-primary-green rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-blue to-primary-green bg-clip-text text-transparent">
                Bizzlink
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsLiked(!isLiked)}>
                <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                {isLiked ? 'Liked' : 'Like'}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-blue/5 to-primary-green/5 rounded-3xl"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] rounded-3xl"></div>
          
          {/* Animated Gradient Border */}
          <div className="relative p-1 rounded-3xl bg-gradient-to-r from-primary-blue via-primary-green to-primary-blue bg-[length:200%_200%] animate-gradient-move">
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12">
              <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-12">
              {/* Profile Image & Basic Info */}
              <div className="flex-shrink-0 mb-8 lg:mb-0">
                <div className="relative">
                  <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-white shadow-2xl">
                    <AvatarImage src={profileData.photoURL} alt={profileData.displayName} className="object-cover" />
                    <AvatarFallback className="text-4xl bg-gradient-to-br from-primary-blue to-primary-green text-white">
                      {profileData.firstname?.[0]}{profileData.lastname?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  {profileData.isVerified && (
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary-blue rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                      <Verified className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      {profileData.displayName || `${profileData.firstname} ${profileData.lastname}`}
                    </h1>
                    {profileData.title && (
                      <p className="text-xl text-gray-600 mb-2">{profileData.title}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      {profileData.about?.city && profileData.about?.country && (
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{profileData.about.city}, {profileData.about.country}</span>
                        </div>
                      )}
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(profileData.createdAt)}</span>
                      </div>
                      {isFreelancer && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          <Briefcase className="w-3 h-3 mr-1" />
                          Freelancer
                        </Badge>
                      )}
                      {isClient && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <Building2 className="w-3 h-3 mr-1" />
                          Client
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {isFreelancer && (
                    <>
                      <div className="text-center p-4 bg-white/50 rounded-xl border border-gray-100">
                        <div className="text-2xl font-bold text-gray-900">
                          {profileData.stats?.averageRating?.toFixed(1) || '0.0'}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center justify-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                          Rating
                        </div>
                      </div>
                      <div className="text-center p-4 bg-white/50 rounded-xl border border-gray-100">
                        <div className="text-2xl font-bold text-gray-900">
                          {profileData.stats?.completedJobs || 0}
                        </div>
                        <div className="text-sm text-gray-600">Jobs Done</div>
                      </div>
                      <div className="text-center p-4 bg-white/50 rounded-xl border border-gray-100">
                        <div className="text-2xl font-bold text-gray-900">
                          {profileData.stats?.totalEarnings ? formatCurrency(profileData.stats.totalEarnings) : '$0'}
                        </div>
                        <div className="text-sm text-gray-600">Earned</div>
                      </div>
                      <div className="text-center p-4 bg-white/50 rounded-xl border border-gray-100">
                        <div className="text-2xl font-bold text-gray-900">
                          {profileData.stats?.responseRate || 0}%
                        </div>
                        <div className="text-sm text-gray-600">Response Rate</div>
                      </div>
                    </>
                  )}
                  {isClient && (
                    <>
                      <div className="text-center p-4 bg-white/50 rounded-xl border border-gray-100">
                        <div className="text-2xl font-bold text-gray-900">
                          {profileData.stats?.totalJobs || 0}
                        </div>
                        <div className="text-sm text-gray-600">Projects</div>
                      </div>
                      <div className="text-center p-4 bg-white/50 rounded-xl border border-gray-100">
                        <div className="text-2xl font-bold text-gray-900">
                          ${((profileData.stats?.totalSpent || 0) / 1000).toFixed(0)}K
                        </div>
                        <div className="text-sm text-gray-600">Spent</div>
                      </div>
                      <div className="text-center p-4 bg-white/50 rounded-xl border border-gray-100">
                        <div className="text-2xl font-bold text-gray-900">
                          {profileData.stats?.hirRate || 0}%
                        </div>
                        <div className="text-sm text-gray-600">Hire Rate</div>
                      </div>
                      <div className="text-center p-4 bg-white/50 rounded-xl border border-gray-100">
                        <div className="text-2xl font-bold text-gray-900">
                          {profileData.stats?.averageRating?.toFixed(1) || '0.0'}
                        </div>
                        <div className="text-sm text-gray-600">
                          <Star className="w-4 h-4 text-yellow-500 fill-current inline mr-1" />
                          Rating
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-primary-blue hover:bg-primary-blue-dark text-white px-6">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact {isFreelancer ? 'Freelancer' : 'Client'}
                  </Button>
                  {isFreelancer && (
                    <Button variant="outline" className="px-6">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Hire Now
                    </Button>
                  )}
                  <Button variant="outline">
                    <Video className="w-4 h-4 mr-2" />
                    Schedule Call
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* About Section */}
            {profileData.overview && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Users className="w-5 h-5 mr-2 text-primary-blue" />
                    About {isFreelancer ? 'This Freelancer' : 'This Client'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed text-lg">{profileData.overview}</p>
                </CardContent>
              </Card>
            )}

            {/* Skills Section (Freelancers Only) */}
            {isFreelancer && profileData.skills && profileData.skills.length > 0 && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Target className="w-5 h-5 mr-2 text-primary-blue" />
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <Badge 
                        key={skill.id} 
                        variant="outline" 
                        className={`px-3 py-1 text-sm font-medium border ${getSkillBadgeColor(index)}`}
                      >
                        {skill.text}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Experience Section (Freelancers Only) */}
            {isFreelancer && profileData.employment && profileData.employment.length > 0 && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Briefcase className="w-5 h-5 mr-2 text-primary-blue" />
                    Work Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {profileData.employment.map((emp, index) => (
                    <div key={emp.id} className="border-l-4 border-primary-blue/20 pl-6 pb-6 last:pb-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">{emp.jobTitle}</h3>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {emp.current ? 'Current' : 'Previous'}
                        </Badge>
                      </div>
                      <p className="text-primary-blue font-medium mb-1">{emp.companyName}</p>
                      <p className="text-gray-600 text-sm mb-2">
                        {emp.startDate} - {emp.current ? 'Present' : emp.endDate}
                        {emp.city && emp.country && ` • ${emp.city}, ${emp.country}`}
                      </p>
                      {emp.description && (
                        <p className="text-gray-700 leading-relaxed">{emp.description}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Education Section (Freelancers Only) */}
            {isFreelancer && profileData.education && profileData.education.length > 0 && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <GraduationCap className="w-5 h-5 mr-2 text-primary-blue" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profileData.education.map((edu) => (
                    <div key={edu.id} className="border border-gray-100 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                        <span className="text-sm text-gray-600">{edu.endDate}</span>
                      </div>
                      <p className="text-primary-blue font-medium">{edu.schoolName}</p>
                      {edu.studyField && (
                        <p className="text-gray-600 text-sm">Field: {edu.studyField}</p>
                      )}
                      {edu.location && (
                        <p className="text-gray-500 text-xs">{edu.location}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Specialties Section (Freelancers Only) */}
            {isFreelancer && profileData.specialties && profileData.specialties.length > 0 && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Zap className="w-5 h-5 mr-2 text-primary-blue" />
                    Specialties
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profileData.specialties.map((specialty, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="px-3 py-1 text-sm font-medium border bg-purple-50 text-purple-700 border-purple-200"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Certifications Section (Freelancers Only) */}
            {isFreelancer && profileData.certifications && profileData.certifications.length > 0 && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Award className="w-5 h-5 mr-2 text-primary-blue" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profileData.certifications.map((cert) => (
                    <div key={cert.id} className="border border-gray-100 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                        <div className="text-sm text-gray-600">
                          {cert.issueDate}
                          {cert.expirationDate && ` - ${cert.expirationDate}`}
                        </div>
                      </div>
                      <p className="text-primary-blue font-medium mb-1">{cert.issuer}</p>
                      {cert.credentialId && (
                        <p className="text-gray-600 text-sm mb-2">ID: {cert.credentialId}</p>
                      )}
                      {cert.credentialUrl && (
                        <a 
                          href={cert.credentialUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary-blue hover:text-primary-blue-dark text-sm transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Certificate
                        </a>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Portfolio Section (Freelancers Only) */}
            {isFreelancer && profileData.portfolio && profileData.portfolio.length > 0 && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <FileText className="w-5 h-5 mr-2 text-primary-blue" />
                    Portfolio
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {profileData.portfolio.map((project) => (
                    <div key={project.id} className="border border-gray-100 rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:space-x-4">
                        {project.imageLink && (
                          <div className="flex-shrink-0 mb-4 md:mb-0">
                            <div className="w-full md:w-32 h-24 bg-gray-100 rounded-lg overflow-hidden">
                              <Image 
                                src={project.imageLink} 
                                alt={project.title}
                                width={128}
                                height={96}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">{project.title}</h3>
                            {project.completionDate && (
                              <span className="text-sm text-gray-600">{project.completionDate}</span>
                            )}
                          </div>
                          {project.role && (
                            <p className="text-primary-blue font-medium text-sm mb-2">{project.role}</p>
                          )}
                          {project.description && (
                            <p className="text-gray-700 leading-relaxed mb-3">{project.description}</p>
                          )}
                          {project.projectUrl && (
                            <a 
                              href={project.projectUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-primary-blue hover:text-primary-blue-dark transition-colors"
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              View Project
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Company Information (Clients Only) */}
            {isClient && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Building2 className="w-5 h-5 mr-2 text-primary-blue" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profileData.about?.companyName && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Company</h4>
                      <p className="text-gray-700 text-lg">{profileData.about.companyName}</p>
                    </div>
                  )}
                  {profileData.about?.industry && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Industry</h4>
                      <p className="text-gray-700">{profileData.about.industry}</p>
                    </div>
                  )}
                  {profileData.about?.companySize && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Company Size</h4>
                      <p className="text-gray-700">{profileData.about.companySize}</p>
                    </div>
                  )}
                  {profileData.about?.companyDescription && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">About the Company</h4>
                      <p className="text-gray-700 leading-relaxed">{profileData.about.companyDescription}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Trust & Verification */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Shield className="w-5 h-5 mr-2 text-primary-blue" />
                  Trust & Safety
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className={`w-4 h-4 mr-2 ${profileData.emailVerified ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className="text-sm">Email Verified</span>
                  </div>
                  {profileData.emailVerified ? (
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Verified</Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">Not Verified</Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className={`w-4 h-4 mr-2 ${profileData.phoneVerified ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className="text-sm">Phone Verified</span>
                  </div>
                  {profileData.phoneVerified ? (
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Verified</Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">Not Verified</Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className={`w-4 h-4 mr-2 ${profileData.isVerified ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className="text-sm">Identity Verified</span>
                  </div>
                  {profileData.isVerified ? (
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Verified</Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">Not Verified</Badge>
                  )}
                </div>
                
                {isFreelancer && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className={`w-4 h-4 mr-2 ${profileData.paymentVerified ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className="text-sm">Payment Verified</span>
                    </div>
                    {profileData.paymentVerified ? (
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Verified</Badge>
                    ) : (
                      <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">Not Verified</Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Mail className="w-5 h-5 mr-2 text-primary-blue" />
                  Contact Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Email available on contact</span>
                </div>
                {profileData.about?.tel && (
                  <div className="flex items-center space-x-3">
                    <PhoneCall className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Phone available on contact</span>
                  </div>
                )}
                <div className="pt-3 border-t">
                  <Button className="w-full bg-primary-blue hover:bg-primary-blue-dark">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            {(profileData.about?.linkedinUrl || profileData.about?.githubUrl || profileData.about?.websiteUrl) && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Globe className="w-5 h-5 mr-2 text-primary-blue" />
                    Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profileData.about?.websiteUrl && (
                    <a 
                      href={profileData.about.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-primary-blue hover:text-primary-blue-dark transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      <span className="text-sm">Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {profileData.about?.linkedinUrl && (
                    <a 
                      href={profileData.about.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-primary-blue hover:text-primary-blue-dark transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span className="text-sm">LinkedIn</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {profileData.about?.githubUrl && (
                    <a 
                      href={profileData.about.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-primary-blue hover:text-primary-blue-dark transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span className="text-sm">GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Languages (Freelancers Only) */}
            {isFreelancer && (profileData.about?.primaryLanguage || (profileData.about?.additionalLanguages && profileData.about.additionalLanguages.length > 0)) && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <LanguagesIcon className="w-5 h-5 mr-2 text-primary-blue" />
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profileData.about?.primaryLanguage && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{profileData.about.primaryLanguage}</span>
                      <Badge variant="outline" className="text-xs">
                        Native
                      </Badge>
                    </div>
                  )}
                  {profileData.about?.additionalLanguages && profileData.about.additionalLanguages.map((lang, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {typeof lang === 'string' ? lang : lang.language}
                      </span>
                      {typeof lang === 'object' && lang.proficiency && (
                        <Badge variant="outline" className="text-xs">
                          {lang.proficiency}
                        </Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Hourly Rate (Freelancers Only) */}
            {isFreelancer && profileData.hourRate && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <DollarSign className="w-5 h-5 mr-2 text-primary-blue" />
                    Hourly Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="">
                    <div className="text-3xl font-bold text-primary-green mb-1">
                      {profileData.hourRate}/hr
                    </div>
                    <p className="text-sm text-gray-600">Starting rate</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
