"use client";

import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  UserCheck,
  MessageSquare,
  CreditCard,
  Star,
  Shield,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Play,
  Briefcase,
  Award,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function HowItWorksPage() {
  const clientSteps = [
    {
      step: 1,
      title: "Post Your Project",
      description:
        "Describe your project, set your budget, and specify the skills you need. Our platform helps you create detailed project briefs that attract the right freelancers.",
      icon: Briefcase,
      color: "bg-blue-500",
      features: [
        "Detailed project descriptions",
        "Budget flexibility",
        "Skill matching",
        "Timeline setting",
      ],
    },
    {
      step: 2,
      title: "Review Proposals",
      description:
        "Receive proposals from qualified freelancers within hours. Review their profiles, portfolios, and past work to find the perfect match for your project.",
      icon: Search,
      color: "bg-cyan-500",
      features: [
        "Instant proposals",
        "Portfolio reviews",
        "Rating system",
        "Interview scheduling",
      ],
    },
    {
      step: 3,
      title: "Hire & Collaborate",
      description:
        "Choose your freelancer and start working together. Use our built-in tools for communication, file sharing, and project management.",
      icon: UserCheck,
      color: "bg-emerald-500",
      features: [
        "Secure messaging",
        "File sharing",
        "Milestone tracking",
        "Time tracking",
      ],
    },
    {
      step: 4,
      title: "Pay Securely",
      description:
        "Release payments through our secure escrow system. Pay only when you're satisfied with the work delivered.",
      icon: CreditCard,
      color: "bg-blue-600",
      features: [
        "Escrow protection",
        "Milestone payments",
        "Dispute resolution",
        "Multiple payment methods",
      ],
    },
  ];

  const freelancerSteps = [
    {
      step: 1,
      title: "Create Your Profile",
      description:
        "Build a comprehensive profile showcasing your skills, experience, and portfolio. Our onboarding process helps you create a standout profile.",
      icon: Users,
      color: "bg-blue-500",
      features: [
        "Skill verification",
        "Portfolio showcase",
        "Experience tracking",
        "Rate setting",
      ],
    },
    {
      step: 2,
      title: "Find Projects",
      description:
        "Browse projects that match your skills and interests. Use our advanced filters to find the perfect opportunities for your expertise.",
      icon: Search,
      color: "bg-cyan-500",
      features: [
        "Smart matching",
        "Custom alerts",
        "Saved searches",
        "Category filters",
      ],
    },
    {
      step: 3,
      title: "Submit Proposals",
      description:
        "Write compelling proposals that showcase your understanding of the project and your unique value proposition.",
      icon: MessageSquare,
      color: "bg-emerald-500",
      features: [
        "Proposal templates",
        "Cover letters",
        "Portfolio attachments",
        "Competitive bidding",
      ],
    },
    {
      step: 4,
      title: "Deliver & Earn",
      description:
        "Complete projects on time and build your reputation. Get paid securely and grow your freelance business.",
      icon: Award,
      color: "bg-blue-600",
      features: [
        "Secure payments",
        "Client feedback",
        "Reputation building",
        "Earnings tracking",
      ],
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Secure Payments",
      description:
        "All payments are protected by our escrow system, ensuring freelancers get paid and clients get quality work.",
    },
    {
      icon: Star,
      title: "Quality Assurance",
      description:
        "Our rating and review system helps maintain high standards and builds trust between clients and freelancers.",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description:
        "Our dedicated support team is available around the clock to help resolve any issues or answer questions.",
    },
    {
      icon: TrendingUp,
      title: "Growth Opportunities",
      description:
        "Access to a global marketplace with unlimited earning potential and career growth opportunities.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-cyan-600 to-emerald-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              How Bizzlink Works
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Connect with top talent or find your next opportunity in just a
              few simple steps
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* For Clients Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800">
              For Clients
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hire Top Freelancers in 4 Easy Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From posting your project to receiving completed work, our
              platform makes hiring freelancers simple and secure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {clientSteps.map((step, index) => (
              <Card
                key={index}
                className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 ${step.color} rounded-lg flex items-center justify-center mb-4`}
                  >
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  <ul className="space-y-2">
                    {step.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-sm text-gray-500"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/projects/post">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Post Your First Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* For Freelancers Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800">
              For Freelancers
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Start Your Freelance Journey Today
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Build your reputation, find great clients, and grow your freelance
              business with our comprehensive platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {freelancerSteps.map((step, index) => (
              <Card
                key={index}
                className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 ${step.color} rounded-lg flex items-center justify-center mb-4`}
                  >
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  <ul className="space-y-2">
                    {step.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-sm text-gray-500"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Start Freelancing
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Bizzlink?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide the tools, security, and support you need to succeed in
              the freelance economy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of successful clients and freelancers on Bizzlink
            today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/projects/post">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Post a Project
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                Join as Freelancer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
