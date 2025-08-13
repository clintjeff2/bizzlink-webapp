"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, AlertTriangle, Mail, Phone, Globe, Calendar, Users, CreditCard, Gavel } from "lucide-react"

export default function TermsOfServicePage() {
  const lastUpdated = "March 1, 2024"

  const keyTerms = [
    {
      title: "User Responsibilities",
      description: "Your obligations when using our platform",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Payment Terms",
      description: "How payments and fees work on Bizzlink",
      icon: CreditCard,
      color: "bg-green-500",
    },
    {
      title: "Dispute Resolution",
      description: "How we handle conflicts and disputes",
      icon: Gavel,
      color: "bg-purple-500",
    },
    {
      title: "Platform Rules",
      description: "Guidelines for acceptable use of our services",
      icon: Shield,
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl text-gray-300 mb-6">
              These terms govern your use of Bizzlink's platform and services. Please read them carefully.
            </p>
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <Calendar className="w-5 h-5" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Terms Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Key Terms Overview</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Understanding the main aspects of our terms of service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {keyTerms.map((term, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 ${term.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <term.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{term.title}</h3>
                  <p className="text-gray-600">{term.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h2>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-8">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-900 mb-2">Agreement to Terms</h3>
                    <p className="text-yellow-800">
                      By accessing and using Bizzlink, you accept and agree to be bound by the terms and provision of
                      this agreement. If you do not agree to abide by the above, please do not use this service.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h3>
              <p className="text-gray-700 mb-6">
                These Terms of Service ("Terms") govern your use of the Bizzlink platform and services operated by
                Bizzlink Inc. ("we," "us," or "our"). By accessing or using our service, you agree to be bound by these
                Terms. If you disagree with any part of these terms, then you may not access the service.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h3>
              <p className="text-gray-700 mb-4">
                Bizzlink is an online platform that connects clients with freelancers for various professional services.
                Our platform provides:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Project posting and bidding functionality</li>
                <li>Communication tools between clients and freelancers</li>
                <li>Payment processing and escrow services</li>
                <li>Dispute resolution mechanisms</li>
                <li>Rating and review systems</li>
                <li>Community features and resources</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h3>

              <h4 className="text-xl font-semibold text-gray-900 mb-3">Account Creation</h4>
              <p className="text-gray-700 mb-4">
                To use our services, you must create an account by providing accurate, complete, and current
                information. You are responsible for:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Ensuring your profile information remains accurate and up-to-date</li>
              </ul>

              <h4 className="text-xl font-semibold text-gray-900 mb-3">Account Types</h4>
              <p className="text-gray-700 mb-4">
                We offer different account types with varying features and limitations:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>
                  <strong>Client Accounts:</strong> For individuals or businesses looking to hire freelancers
                </li>
                <li>
                  <strong>Freelancer Accounts:</strong> For professionals offering services
                </li>
                <li>
                  <strong>Dual Accounts:</strong> Users can operate as both clients and freelancers
                </li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">4. User Conduct and Responsibilities</h3>

              <h4 className="text-xl font-semibold text-gray-900 mb-3">Acceptable Use</h4>
              <p className="text-gray-700 mb-4">
                You agree to use our platform only for lawful purposes and in accordance with these Terms. You agree not
                to:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Post false, misleading, or fraudulent content</li>
                <li>Engage in harassment, discrimination, or abusive behavior</li>
                <li>Attempt to circumvent platform fees or payment systems</li>
                <li>Use automated systems to access or interact with the platform</li>
                <li>Share account credentials or allow unauthorized access</li>
              </ul>

              <h4 className="text-xl font-semibold text-gray-900 mb-3">Content Standards</h4>
              <p className="text-gray-700 mb-4">All content you post must be:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Accurate and truthful</li>
                <li>Your own original work or properly licensed</li>
                <li>Professional and appropriate</li>
                <li>Free from malicious code or harmful content</li>
                <li>Compliant with applicable laws and regulations</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">5. Payment Terms</h3>

              <h4 className="text-xl font-semibold text-gray-900 mb-3">Service Fees</h4>
              <p className="text-gray-700 mb-4">Bizzlink charges service fees for successful transactions:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>
                  <strong>Freelancer Fee:</strong> 10% of earnings from completed projects
                </li>
                <li>
                  <strong>Client Fee:</strong> 3% processing fee on payments made
                </li>
                <li>
                  <strong>Payment Processing:</strong> Additional fees may apply for certain payment methods
                </li>
                <li>
                  <strong>Currency Conversion:</strong> Fees apply for international transactions
                </li>
              </ul>

              <h4 className="text-xl font-semibold text-gray-900 mb-3">Payment Processing</h4>
              <p className="text-gray-700 mb-4">All payments are processed through our secure payment system:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Fixed-price projects use escrow protection</li>
                <li>Hourly projects are billed weekly</li>
                <li>Payments are released upon milestone completion</li>
                <li>Disputes may result in payment holds</li>
                <li>Refunds are subject to our refund policy</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h3>

              <h4 className="text-xl font-semibold text-gray-900 mb-3">Platform Content</h4>
              <p className="text-gray-700 mb-4">
                The Bizzlink platform, including its design, functionality, and content, is owned by Bizzlink Inc. and
                protected by intellectual property laws. You may not:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Copy, modify, or distribute our platform content</li>
                <li>Reverse engineer or attempt to extract source code</li>
                <li>Use our trademarks or branding without permission</li>
                <li>Create derivative works based on our platform</li>
              </ul>

              <h4 className="text-xl font-semibold text-gray-900 mb-3">User Content</h4>
              <p className="text-gray-700 mb-6">
                You retain ownership of content you create and post on our platform. However, by posting content, you
                grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content
                in connection with our services.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">7. Dispute Resolution</h3>

              <h4 className="text-xl font-semibold text-gray-900 mb-3">Platform Disputes</h4>
              <p className="text-gray-700 mb-4">We provide dispute resolution services for conflicts between users:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Initial resolution through direct communication</li>
                <li>Mediation services provided by our support team</li>
                <li>Formal dispute process with evidence review</li>
                <li>Final decisions are binding on all parties</li>
                <li>Appeals process available for certain decisions</li>
              </ul>

              <h4 className="text-xl font-semibold text-gray-900 mb-3">Legal Disputes</h4>
              <p className="text-gray-700 mb-6">
                Any legal disputes arising from these Terms or your use of our services will be resolved through binding
                arbitration in accordance with the rules of the American Arbitration Association, except where
                prohibited by law.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h3>
              <p className="text-gray-700 mb-6">
                To the maximum extent permitted by law, Bizzlink shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages, including without limitation, loss of profits, data, use,
                goodwill, or other intangible losses, resulting from your use of our services.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h3>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account and access to our services at our sole discretion, without
                prior notice, for conduct that we believe:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Violates these Terms or our policies</li>
                <li>Is harmful to other users or our business</li>
                <li>Exposes us to legal liability</li>
                <li>Is fraudulent or involves illegal activities</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h3>
              <p className="text-gray-700 mb-6">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes via
                email or platform notifications. Continued use of our services after changes constitutes acceptance of
                the new Terms.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h3>
              <p className="text-gray-700 mb-6">
                These Terms are governed by and construed in accordance with the laws of the State of New York, without
                regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms
                will not be considered a waiver of those rights.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h3>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">legal@bizzlink.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Globe className="w-5 h-5 text-gray-600 mt-1" />
                    <div className="text-gray-700">
                      <p>Bizzlink Legal Department</p>
                      <p>123 Business Ave, Suite 100</p>
                      <p>New York, NY 10001</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
