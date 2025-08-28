"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Search,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Video,
  Users,
  Shield,
  CreditCard,
  Settings,
  Briefcase,
  AlertCircle,
  ChevronRight,
  Zap,
} from "lucide-react"

export default function HelpCenterPage() {
  const supportOptions = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: MessageSquare,
      color: "bg-blue-500",
      availability: "24/7",
      responseTime: "< 2 minutes",
    },
    {
      title: "Phone Support",
      description: "Speak directly with a support specialist",
      icon: Phone,
      color: "bg-green-500",
      availability: "Mon-Fri 9AM-6PM EST",
      responseTime: "Immediate",
    },
    {
      title: "Email Support",
      description: "Send us a detailed message about your issue",
      icon: Mail,
      color: "bg-green-500",
      availability: "24/7",
      responseTime: "< 4 hours",
    },
    {
      title: "Community Forum",
      description: "Get help from other users and experts",
      icon: Users,
      color: "bg-orange-500",
      availability: "24/7",
      responseTime: "Varies",
    },
  ]

  const popularTopics = [
    {
      title: "Getting Started",
      icon: Zap,
      color: "bg-blue-500",
      articles: 24,
      description: "Learn the basics of using Bizzlink",
    },
    {
      title: "Account & Profile",
      icon: Settings,
      color: "bg-green-500",
      articles: 18,
      description: "Manage your account settings and profile",
    },
    {
      title: "Payments & Billing",
      icon: CreditCard,
      color: "bg-green-500",
      articles: 32,
      description: "Payment methods, invoicing, and billing",
    },
    {
      title: "Project Management",
      icon: Briefcase,
      color: "bg-orange-500",
      articles: 28,
      description: "Creating, managing, and completing projects",
    },
    {
      title: "Safety & Security",
      icon: Shield,
      color: "bg-red-500",
      articles: 15,
      description: "Keep your account and data secure",
    },
    {
      title: "Disputes & Resolution",
      icon: AlertCircle,
      color: "bg-yellow-500",
      articles: 12,
      description: "Resolve conflicts and disputes",
    },
  ]

  const frequentlyAsked = {
    general: [
      {
        question: "How do I create an account on Bizzlink?",
        answer:
          "Creating an account is simple! Click the 'Sign Up' button in the top right corner, choose whether you're a client or freelancer, fill in your basic information, and verify your email address. You'll then be guided through setting up your profile.",
      },
      {
        question: "Is Bizzlink free to use?",
        answer:
          "Yes, creating an account and browsing projects is completely free. We only charge a small service fee when you successfully complete a transaction. For freelancers, this is 10% of earnings. For clients, there's a 3% processing fee on payments.",
      },
      {
        question: "How do I reset my password?",
        answer:
          "Click 'Forgot Password' on the login page, enter your email address, and we'll send you a secure link to reset your password. The link expires after 24 hours for security reasons.",
      },
      {
        question: "Can I change my account type from client to freelancer?",
        answer:
          "Yes! You can switch between client and freelancer modes in your account settings. However, you'll need to complete the appropriate profile setup for each role.",
      },
    ],
    freelancers: [
      {
        question: "How do I get my first client on Bizzlink?",
        answer:
          "Start by completing your profile with a professional photo, detailed description, and portfolio samples. Then browse projects in your skill area and submit personalized proposals. Focus on smaller projects initially to build your reputation and reviews.",
      },
      {
        question: "When and how do I get paid?",
        answer:
          "Payments are released when project milestones are completed and approved by the client. For hourly projects, payments are processed weekly. Funds are available in your account immediately and can be withdrawn to your bank account or PayPal within 1-3 business days.",
      },
      {
        question: "What should I include in my proposal?",
        answer:
          "A great proposal should address the client's specific needs, showcase relevant experience, provide a clear timeline and budget, and demonstrate your understanding of the project. Keep it concise but comprehensive, and always personalize it for each project.",
      },
      {
        question: "How do I handle difficult clients?",
        answer:
          "Always maintain professional communication, document all agreements in writing, set clear expectations upfront, and don't hesitate to contact our support team if issues arise. We're here to help mediate and resolve conflicts fairly.",
      },
    ],
    clients: [
      {
        question: "How do I find the right freelancer for my project?",
        answer:
          "Start by posting a detailed project description with clear requirements and budget. Review proposals carefully, check freelancer profiles and portfolios, read previous client reviews, and consider conducting brief interviews with your top candidates.",
      },
      {
        question: "How does payment protection work?",
        answer:
          "We use an escrow system to protect both parties. For fixed-price projects, funds are held securely until work is completed. For hourly projects, you're only charged for approved time. You can request refunds for unsatisfactory work through our dispute resolution process.",
      },
      {
        question: "What if I'm not satisfied with the work delivered?",
        answer:
          "First, communicate your concerns clearly with the freelancer and give them a chance to make revisions. If you can't reach a resolution, you can open a dispute through our platform, and our team will review the case and help mediate a fair solution.",
      },
      {
        question: "Can I hire the same freelancer for multiple projects?",
        answer:
          "Once you find a great freelancer, you can hire them directly for future projects. Many clients build long-term relationships with trusted freelancers, which often leads to better rates and faster turnaround times.",
      },
    ],
  }

  const videoTutorials = [
    {
      title: "Getting Started with Bizzlink",
      duration: "5:32",
      views: "12.5K",
      category: "Basics",
      thumbnail: "/general-dashboard-interface.png",
    },
    {
      title: "Creating Your First Project Post",
      duration: "8:15",
      views: "9.8K",
      category: "Clients",
      thumbnail: "/ecommerce-website-homepage.png",
    },
    {
      title: "Building a Winning Freelancer Profile",
      duration: "12:45",
      views: "15.2K",
      category: "Freelancers",
      thumbnail: "/professional-woman-developer.png",
    },
    {
      title: "Understanding Payments and Fees",
      duration: "6:28",
      views: "7.3K",
      category: "Payments",
      thumbnail: "/mobile-banking-app.png",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-teal-600 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Help Center</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Find answers, get support, and learn how to make the most of Bizzlink
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search for help articles, guides, and tutorials..."
                  className="pl-12 pr-4 py-4 text-lg bg-white/10 border-white/20 text-white placeholder-white/70"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-blue-600 hover:bg-gray-100">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get Support Your Way</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Choose the support option that works best for you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportOptions.map((option, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <CardContent className="p-6">
                  <div
                    className={`w-16 h-16 ${option.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <option.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{option.availability}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{option.responseTime}</span>
                    </div>
                  </div>
                  <Button className="w-full">Contact Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Help Topics</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Browse our most helpful articles and guides</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularTopics.map((topic, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div
                      className={`w-12 h-12 ${topic.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <topic.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{topic.title}</h3>
                      <p className="text-sm text-gray-500">{topic.articles} articles</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{topic.description}</p>
                  <div className="flex items-center text-blue-600 text-sm font-medium">
                    <span>Browse articles</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Quick answers to common questions</p>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="grid w-full max-w-md grid-cols-3 h-12">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="freelancers">Freelancers</TabsTrigger>
                <TabsTrigger value="clients">Clients</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="general">
              <Accordion type="single" collapsible className="w-full">
                {frequentlyAsked.general.map((faq, index) => (
                  <AccordionItem key={index} value={`general-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="freelancers">
              <Accordion type="single" collapsible className="w-full">
                {frequentlyAsked.freelancers.map((faq, index) => (
                  <AccordionItem key={index} value={`freelancer-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="clients">
              <Accordion type="single" collapsible className="w-full">
                {frequentlyAsked.clients.map((faq, index) => (
                  <AccordionItem key={index} value={`client-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-red-100 text-red-800">Video Tutorials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Learn with Video Guides</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Step-by-step video tutorials to help you master Bizzlink
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {videoTutorials.map((video, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <Video className="w-6 h-6 text-gray-900" />
                    </div>
                  </div>
                  <Badge className="absolute top-2 right-2 bg-black bg-opacity-70 text-white">{video.duration}</Badge>
                </div>
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2 text-xs">
                    {video.category}
                  </Badge>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                  <p className="text-sm text-gray-500">{video.views} views</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              <Video className="w-5 h-5 mr-2" />
              View All Tutorials
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Still Need Help?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Our support team is here to help you succeed. Get in touch with us anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <MessageSquare className="w-5 h-5 mr-2" />
              Start Live Chat
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              <Mail className="w-5 h-5 mr-2" />
              Send Email
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
