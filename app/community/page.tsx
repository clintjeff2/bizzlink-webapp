"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  MessageSquare,
  Calendar,
  Award,
  TrendingUp,
  Heart,
  Share2,
  BookOpen,
  Clock,
  ExternalLink,
  UserPlus,
  Search,
  Filter,
  Target,
  Lightbulb,
} from "lucide-react"

export default function CommunityPage() {
  const communityStats = [
    { label: "Active Members", value: "25,000+", icon: Users, color: "text-blue-600" },
    { label: "Daily Discussions", value: "500+", icon: MessageSquare, color: "text-green-600" },
    { label: "Monthly Events", value: "20+", icon: Calendar, color: "text-purple-600" },
    { label: "Success Stories", value: "1,200+", icon: Award, color: "text-orange-600" },
  ]

  const featuredDiscussions = [
    {
      title: "How to Handle Difficult Clients: A Complete Guide",
      author: "Sarah Chen",
      avatar: "/professional-woman-developer.png",
      category: "Client Relations",
      replies: 47,
      likes: 156,
      timeAgo: "2 hours ago",
      trending: true,
    },
    {
      title: "AI Tools That Are Changing Freelance Work",
      author: "Marcus Rodriguez",
      avatar: "/professional-man-designer.png",
      category: "Technology",
      replies: 89,
      likes: 234,
      timeAgo: "5 hours ago",
      trending: true,
    },
    {
      title: "Pricing Strategies for 2024: What's Working",
      author: "Emily Johnson",
      avatar: "/professional-woman-marketer.png",
      category: "Business",
      replies: 62,
      likes: 189,
      timeAgo: "1 day ago",
      trending: false,
    },
    {
      title: "Building Long-term Client Relationships",
      author: "David Kim",
      avatar: "/professional-asian-woman-developer.png",
      category: "Growth",
      replies: 34,
      likes: 98,
      timeAgo: "2 days ago",
      trending: false,
    },
  ]

  const upcomingEvents = [
    {
      title: "Freelancer Networking Mixer",
      date: "March 15, 2024",
      time: "6:00 PM EST",
      type: "Virtual",
      attendees: 150,
      category: "Networking",
      description: "Connect with fellow freelancers and share experiences over virtual coffee.",
    },
    {
      title: "Client Acquisition Masterclass",
      date: "March 18, 2024",
      time: "2:00 PM EST",
      type: "Workshop",
      attendees: 89,
      category: "Education",
      description: "Learn proven strategies to find and attract high-paying clients.",
    },
    {
      title: "Freelance Success Stories Panel",
      date: "March 22, 2024",
      time: "1:00 PM EST",
      type: "Panel",
      attendees: 200,
      category: "Inspiration",
      description: "Hear from successful freelancers who've built 6-figure businesses.",
    },
  ]

  const topContributors = [
    {
      name: "Sarah Chen",
      avatar: "/professional-woman-developer.png",
      title: "Senior UX Designer",
      contributions: 245,
      helpfulAnswers: 89,
      badge: "Community Expert",
    },
    {
      name: "Marcus Rodriguez",
      avatar: "/professional-man-designer.png",
      title: "Full-Stack Developer",
      contributions: 198,
      helpfulAnswers: 76,
      badge: "Top Contributor",
    },
    {
      name: "Emily Johnson",
      avatar: "/professional-woman-marketer.png",
      title: "Digital Marketing Strategist",
      contributions: 167,
      helpfulAnswers: 62,
      badge: "Rising Star",
    },
    {
      name: "David Kim",
      avatar: "/professional-asian-woman-developer.png",
      title: "Mobile App Developer",
      contributions: 134,
      helpfulAnswers: 45,
      badge: "Helper",
    },
  ]

  const communityGroups = [
    {
      name: "Web Developers United",
      members: 5420,
      category: "Development",
      description: "Share code, discuss frameworks, and collaborate on web projects.",
      icon: "💻",
      activity: "Very Active",
    },
    {
      name: "Design Inspiration Hub",
      members: 3890,
      category: "Design",
      description: "Showcase your work, get feedback, and find design inspiration.",
      icon: "🎨",
      activity: "Active",
    },
    {
      name: "Marketing Mavens",
      members: 2760,
      category: "Marketing",
      description: "Discuss strategies, share case studies, and grow your marketing skills.",
      icon: "📈",
      activity: "Active",
    },
    {
      name: "Freelance Business Owners",
      members: 4150,
      category: "Business",
      description: "Scale your freelance business and share entrepreneurial insights.",
      icon: "🚀",
      activity: "Very Active",
    },
    {
      name: "Content Creators Circle",
      members: 2340,
      category: "Content",
      description: "Writers, videographers, and content strategists unite!",
      icon: "✍️",
      activity: "Moderate",
    },
    {
      name: "Remote Work Warriors",
      members: 6780,
      category: "Lifestyle",
      description: "Tips, tools, and stories from the remote work lifestyle.",
      icon: "🌍",
      activity: "Very Active",
    },
  ]

  const successStories = [
    {
      author: "Lisa Park",
      avatar: "/professional-woman-writer.png",
      title: "From $15/hour to $150/hour in 8 months",
      excerpt:
        "How I transformed my freelance writing career by specializing in fintech content and building strong client relationships...",
      likes: 342,
      comments: 28,
      timeAgo: "3 days ago",
    },
    {
      author: "Ahmed Hassan",
      avatar: "/middle-eastern-data-scientist.png",
      title: "Building a $200K/year data science consultancy",
      excerpt:
        "My journey from corporate employee to successful freelance data scientist, including the mistakes I made and lessons learned...",
      likes: 289,
      comments: 45,
      timeAgo: "1 week ago",
    },
    {
      author: "Maria Santos",
      avatar: "/latina-marketer.png",
      title: "How I landed my first $50K project",
      excerpt:
        "The proposal strategy and relationship-building approach that helped me secure my biggest client to date...",
      likes: 198,
      comments: 32,
      timeAgo: "2 weeks ago",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Join Our Thriving Community</h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100 max-w-3xl mx-auto">
              Connect with 25,000+ freelancers and clients, share knowledge, and grow together
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                <UserPlus className="w-5 h-5 mr-2" />
                Join Community
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-indigo-600 bg-transparent"
              >
                <Search className="w-5 h-5 mr-2" />
                Explore Discussions
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {communityStats.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="discussions" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="grid w-full max-w-2xl grid-cols-4 h-12">
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="groups">Groups</TabsTrigger>
                <TabsTrigger value="stories">Stories</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="discussions" className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Featured Discussions</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm">Start Discussion</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {featuredDiscussions.map((discussion, index) => (
                    <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={discussion.avatar || "/placeholder.svg"} alt={discussion.author} className="object-cover" />
                            <AvatarFallback>
                              {discussion.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="outline">{discussion.category}</Badge>
                              {discussion.trending && (
                                <Badge className="bg-red-100 text-red-800">
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  Trending
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                              {discussion.title}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>by {discussion.author}</span>
                              <span>{discussion.timeAgo}</span>
                            </div>
                            <div className="flex items-center space-x-6 mt-4">
                              <div className="flex items-center space-x-1">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-sm">{discussion.replies} replies</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Heart className="w-4 h-4" />
                                <span className="text-sm">{discussion.likes} likes</span>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Share2 className="w-4 h-4 mr-1" />
                                Share
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="space-y-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Award className="w-5 h-5 text-yellow-600" />
                        <span>Top Contributors</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {topContributors.map((contributor, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={contributor.avatar || "/placeholder.svg"} alt={contributor.name} className="object-cover" />
                            <AvatarFallback>
                              {contributor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{contributor.name}</h4>
                            <p className="text-sm text-gray-600">{contributor.title}</p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {contributor.badge}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{contributor.contributions}</p>
                            <p className="text-xs text-gray-500">contributions</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
                <Button>
                  <Calendar className="w-4 h-4 mr-2" />
                  View All Events
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-blue-100 text-blue-800">{event.category}</Badge>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                      <CardTitle className="text-lg text-gray-900">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{event.attendees} attending</span>
                        </div>
                      </div>
                      <Button className="w-full">Register Now</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="groups" className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Community Groups</h2>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Group
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {communityGroups.map((group, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="text-2xl">{group.icon}</div>
                        <div>
                          <CardTitle className="text-lg text-gray-900">{group.name}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {group.category}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{group.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{group.members.toLocaleString()} members</span>
                        </div>
                        <Badge
                          className={`text-xs ${
                            group.activity === "Very Active"
                              ? "bg-green-100 text-green-800"
                              : group.activity === "Active"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {group.activity}
                        </Badge>
                      </div>
                      <Button className="w-full bg-transparent" variant="outline">
                        Join Group
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="stories" className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Success Stories</h2>
                <Button>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Share Your Story
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {successStories.map((story, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={story.avatar || "/placeholder.svg"} alt={story.author} className="object-cover" />
                          <AvatarFallback>
                            {story.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                            {story.title}
                          </h3>
                          <p className="text-gray-600 mb-4">{story.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>by {story.author}</span>
                              <span>{story.timeAgo}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1 text-sm text-gray-500">
                                <Heart className="w-4 h-4" />
                                <span>{story.likes}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-sm text-gray-500">
                                <MessageSquare className="w-4 h-4" />
                                <span>{story.comments}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Community Guidelines</h2>
          <p className="text-xl text-gray-600 mb-8">Help us maintain a positive, supportive environment for everyone</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Be Respectful</h3>
              <p className="text-gray-600">Treat all community members with kindness and respect</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Share Knowledge</h3>
              <p className="text-gray-600">Help others by sharing your expertise and experiences</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay On Topic</h3>
              <p className="text-gray-600">Keep discussions relevant and valuable to the community</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl mb-8 text-indigo-100">
            Connect with thousands of freelancers and clients who are building successful careers together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
              <UserPlus className="w-5 h-5 mr-2" />
              Join Community
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-indigo-600 bg-transparent"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
