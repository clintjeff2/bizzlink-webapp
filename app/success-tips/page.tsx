"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Target,
  Users,
  MessageSquare,
  Star,
  CheckCircle,
  Lightbulb,
  Award,
  BookOpen,
  FileText,
  Handshake,
} from "lucide-react"
import Link from "next/link"

export default function SuccessTipsPage() {
  const clientTips = [
    {
      category: "Project Planning",
      icon: Target,
      color: "bg-blue-500",
      tips: [
        {
          title: "Write Clear Project Descriptions",
          description: "Be specific about what you need. Include project goals, deliverables, and success criteria.",
          actionItems: [
            "Define project scope and objectives clearly",
            "List specific deliverables and deadlines",
            "Include examples or references when possible",
            "Specify technical requirements and constraints",
          ],
        },
        {
          title: "Set Realistic Budgets",
          description:
            "Research market rates and set budgets that attract quality freelancers while staying within your means.",
          actionItems: [
            "Research average rates for your project type",
            "Consider project complexity and timeline",
            "Leave room for revisions and additional work",
            "Be transparent about your budget constraints",
          ],
        },
        {
          title: "Define Success Metrics",
          description: "Establish clear criteria for project success to avoid misunderstandings later.",
          actionItems: [
            "Set measurable goals and KPIs",
            "Define quality standards and acceptance criteria",
            "Establish timeline milestones",
            "Create a project evaluation framework",
          ],
        },
      ],
    },
    {
      category: "Hiring Process",
      icon: Users,
      color: "bg-green-500",
      tips: [
        {
          title: "Review Portfolios Thoroughly",
          description: "Look beyond ratings and examine actual work samples that match your project needs.",
          actionItems: [
            "Check portfolio relevance to your project",
            "Assess quality and attention to detail",
            "Look for consistent work standards",
            "Verify authenticity of work samples",
          ],
        },
        {
          title: "Conduct Effective Interviews",
          description: "Ask the right questions to assess both technical skills and communication abilities.",
          actionItems: [
            "Prepare project-specific questions",
            "Test communication skills and responsiveness",
            "Discuss project timeline and availability",
            "Assess problem-solving approach",
          ],
        },
        {
          title: "Check References",
          description: "Contact previous clients to verify work quality and professionalism.",
          actionItems: [
            "Read client reviews carefully",
            "Ask for additional references if needed",
            "Verify completion rates and timeliness",
            "Check for any red flags or concerns",
          ],
        },
      ],
    },
    {
      category: "Project Management",
      icon: MessageSquare,
      color: "bg-purple-500",
      tips: [
        {
          title: "Maintain Regular Communication",
          description: "Stay in touch with your freelancer to ensure project stays on track.",
          actionItems: [
            "Schedule regular check-ins and updates",
            "Use project management tools effectively",
            "Provide timely feedback on deliverables",
            "Be available for questions and clarifications",
          ],
        },
        {
          title: "Provide Constructive Feedback",
          description: "Give specific, actionable feedback to help freelancers deliver exactly what you need.",
          actionItems: [
            "Be specific about what needs to change",
            "Explain the reasoning behind feedback",
            "Provide examples or references",
            "Acknowledge good work and progress",
          ],
        },
        {
          title: "Manage Scope Creep",
          description: "Keep projects on track by managing changes and additions professionally.",
          actionItems: [
            "Document all project changes",
            "Discuss budget implications of changes",
            "Update timelines when scope changes",
            "Maintain clear change approval process",
          ],
        },
      ],
    },
  ]

  const freelancerTips = [
    {
      category: "Profile Optimization",
      icon: Star,
      color: "bg-indigo-500",
      tips: [
        {
          title: "Create a Compelling Profile",
          description:
            "Your profile is your first impression. Make it count with professional presentation and clear value proposition.",
          actionItems: [
            "Use a professional profile photo",
            "Write a compelling headline and summary",
            "Showcase your best work in portfolio",
            "Include relevant skills and certifications",
          ],
        },
        {
          title: "Build a Strong Portfolio",
          description: "Showcase diverse, high-quality work that demonstrates your capabilities and expertise.",
          actionItems: [
            "Include 5-10 of your best projects",
            "Show variety in project types and industries",
            "Explain your role and impact on each project",
            "Keep portfolio updated with recent work",
          ],
        },
        {
          title: "Optimize for Search",
          description: "Use relevant keywords and skills to help clients find you more easily.",
          actionItems: [
            "Research popular keywords in your field",
            "Include skills that clients commonly search for",
            "Update your profile regularly",
            "Use industry-specific terminology",
          ],
        },
      ],
    },
    {
      category: "Proposal Writing",
      icon: FileText,
      color: "bg-teal-500",
      tips: [
        {
          title: "Personalize Every Proposal",
          description: "Show clients you've read their project carefully and understand their specific needs.",
          actionItems: [
            "Address the client by name",
            "Reference specific project requirements",
            "Explain your approach to their unique challenges",
            "Show relevant experience and examples",
          ],
        },
        {
          title: "Demonstrate Value",
          description: "Focus on the value you'll provide rather than just listing your skills.",
          actionItems: [
            "Explain how you'll solve their problem",
            "Highlight relevant experience and results",
            "Provide a clear project timeline",
            "Include next steps and deliverables",
          ],
        },
        {
          title: "Price Competitively",
          description: "Balance competitive pricing with fair compensation for your expertise.",
          actionItems: [
            "Research market rates for similar projects",
            "Consider project complexity and timeline",
            "Factor in revisions and communication time",
            "Be transparent about your pricing structure",
          ],
        },
      ],
    },
    {
      category: "Client Relations",
      icon: Handshake,
      color: "bg-pink-500",
      tips: [
        {
          title: "Communicate Proactively",
          description: "Keep clients informed about progress and any potential issues before they become problems.",
          actionItems: [
            "Send regular progress updates",
            "Communicate delays or issues immediately",
            "Ask questions when requirements are unclear",
            "Confirm understanding of feedback and changes",
          ],
        },
        {
          title: "Exceed Expectations",
          description: "Go above and beyond to deliver exceptional value and build long-term relationships.",
          actionItems: [
            "Deliver work ahead of schedule when possible",
            "Provide additional insights or suggestions",
            "Ensure work is polished and professional",
            "Follow up after project completion",
          ],
        },
        {
          title: "Handle Difficult Situations",
          description: "Navigate challenges professionally to maintain positive relationships.",
          actionItems: [
            "Stay calm and professional in all communications",
            "Focus on solutions rather than problems",
            "Document important decisions and agreements",
            "Know when to escalate to platform support",
          ],
        },
      ],
    },
  ]

  const successStories = [
    {
      name: "Sarah Chen",
      role: "UX Designer",
      story:
        "Increased her income by 300% in 6 months by specializing in mobile app design and building strong client relationships.",
      tip: "Focus on a specific niche and become the go-to expert in that area.",
    },
    {
      name: "Marcus Rodriguez",
      role: "Web Developer",
      story:
        "Built a team of 5 freelancers and now manages $50K+ projects by starting with small projects and proving his value.",
      tip: "Start small, deliver exceptional work, and gradually take on larger projects.",
    },
    {
      name: "Emily Johnson",
      role: "Content Strategist",
      story:
        "Secured 3 long-term retainer clients worth $120K annually by focusing on results and ROI for her clients.",
      tip: "Always tie your work to business outcomes and measurable results.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-teal-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Success Tips & Best Practices</h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              Learn from the best and accelerate your success on Bizzlink with proven strategies and expert advice
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                <BookOpen className="w-5 h-5 mr-2" />
                Download Guide
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
              >
                Watch Tutorials
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="clients" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
                <TabsTrigger value="clients" className="text-base">
                  For Clients
                </TabsTrigger>
                <TabsTrigger value="freelancers" className="text-base">
                  For Freelancers
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="clients" className="space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Client Success Strategies</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Master the art of working with freelancers to get exceptional results for your projects
                </p>
              </div>

              {clientTips.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-8">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{category.category}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {category.tips.map((tip, tipIndex) => (
                      <Card key={tipIndex} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardHeader>
                          <CardTitle className="text-lg text-gray-900">{tip.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4">{tip.description}</p>
                          <ul className="space-y-2">
                            {tip.actionItems.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start text-sm text-gray-700">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="freelancers" className="space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Freelancer Success Strategies</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Build a thriving freelance business with proven tactics from top-performing freelancers
                </p>
              </div>

              {freelancerTips.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-8">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{category.category}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {category.tips.map((tip, tipIndex) => (
                      <Card key={tipIndex} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardHeader>
                          <CardTitle className="text-lg text-gray-900">{tip.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4">{tip.description}</p>
                          <ul className="space-y-2">
                            {tip.actionItems.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start text-sm text-gray-700">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-yellow-100 text-yellow-800">Success Stories</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Learn from Top Performers</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from freelancers who've built successful businesses on Bizzlink
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{story.name}</h3>
                      <p className="text-sm text-gray-600">{story.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{story.story}</p>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-yellow-800 font-medium">{story.tip}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-teal-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Apply These Tips?</h2>
          <p className="text-xl mb-8 text-green-100">
            Start implementing these strategies today and see the difference in your results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/projects/post">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Post Your Project
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
              >
                Start Freelancing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
