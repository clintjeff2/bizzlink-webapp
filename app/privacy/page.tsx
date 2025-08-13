"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Lock, Eye, Database, Globe, AlertTriangle, Mail, Phone, Calendar } from "lucide-react"

export default function PrivacyPolicyPage() {
  const lastUpdated = "March 1, 2024"

  const privacyPrinciples = [
    {
      title: "Transparency",
      description: "We clearly explain what data we collect and how we use it",
      icon: Eye,
      color: "bg-blue-500",
    },
    {
      title: "Security",
      description: "Your data is protected with industry-leading security measures",
      icon: Shield,
      color: "bg-green-500",
    },
    {
      title: "Control",
      description: "You have full control over your personal information",
      icon: Lock,
      color: "bg-purple-500",
    },
    {
      title: "Minimal Collection",
      description: "We only collect data that's necessary for our services",
      icon: Database,
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl text-gray-300 mb-6">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal
              information.
            </p>
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <Calendar className="w-5 h-5" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Privacy Principles</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide how we handle your personal information
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {privacyPrinciples.map((principle, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <CardContent className="p-6">
                  <div
                    className={`w-16 h-16 ${principle.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <principle.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{principle.title}</h3>
                  <p className="text-gray-600">{principle.description}</p>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h2>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Important Notice</h3>
                    <p className="text-blue-800">
                      This Privacy Policy applies to all users of Bizzlink's platform and services. By using our
                      platform, you agree to the collection and use of information in accordance with this policy.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h3>

              <h4 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h4>
              <p className="text-gray-700 mb-4">
                When you create an account or use our services, we may collect the following personal information:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Name, email address, and contact information</li>
                <li>Profile information including skills, experience, and portfolio</li>
                <li>Payment information and billing details</li>
                <li>Identity verification documents when required</li>
                <li>Communication preferences and settings</li>
              </ul>

              <h4 className="text-xl font-semibold text-gray-900 mb-3">Usage Information</h4>
              <p className="text-gray-700 mb-4">We automatically collect information about how you use our platform:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Log data including IP address, browser type, and device information</li>
                <li>Pages visited, features used, and time spent on the platform</li>
                <li>Search queries and interaction with content</li>
                <li>Location data (with your permission)</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h3>
              <p className="text-gray-700 mb-4">We use the information we collect for the following purposes:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices, updates, and security alerts</li>
                <li>Respond to your comments, questions, and customer service requests</li>
                <li>Communicate with you about products, services, and promotional offers</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, investigate, and prevent fraudulent transactions</li>
                <li>Comply with legal obligations and enforce our terms</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing and Disclosure</h3>

              <h4 className="text-xl font-semibold text-gray-900 mb-3">With Other Users</h4>
              <p className="text-gray-700 mb-4">
                When you use our platform, certain information is shared with other users:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Profile information visible to potential clients or freelancers</li>
                <li>Work history, ratings, and reviews</li>
                <li>Project-related communications and files</li>
                <li>Public forum posts and community contributions</li>
              </ul>

              <h4 className="text-xl font-semibold text-gray-900 mb-3">With Service Providers</h4>
              <p className="text-gray-700 mb-4">
                We may share your information with third-party service providers who perform services on our behalf:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Payment processors for transaction handling</li>
                <li>Cloud storage providers for data hosting</li>
                <li>Email service providers for communications</li>
                <li>Analytics providers for usage insights</li>
                <li>Customer support tools and services</li>
              </ul>

              <h4 className="text-xl font-semibold text-gray-900 mb-3">Legal Requirements</h4>
              <p className="text-gray-700 mb-6">
                We may disclose your information if required by law or in response to valid requests by public
                authorities, including to meet national security or law enforcement requirements.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h3>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Employee training on data protection</li>
                <li>Incident response procedures</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights and Choices</h3>
              <p className="text-gray-700 mb-4">You have the following rights regarding your personal information:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>
                  <strong>Access:</strong> Request a copy of your personal information
                </li>
                <li>
                  <strong>Correction:</strong> Update or correct inaccurate information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal information
                </li>
                <li>
                  <strong>Portability:</strong> Receive your data in a structured format
                </li>
                <li>
                  <strong>Objection:</strong> Object to certain processing activities
                </li>
                <li>
                  <strong>Restriction:</strong> Request limitation of processing
                </li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies and Tracking Technologies</h3>
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to collect and use personal information about you. Our
                Cookie Policy provides detailed information about:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Types of cookies we use</li>
                <li>How to manage cookie preferences</li>
                <li>Third-party cookies and analytics</li>
                <li>Advertising and marketing cookies</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">7. International Data Transfers</h3>
              <p className="text-gray-700 mb-6">
                Your information may be transferred to and processed in countries other than your own. We ensure
                appropriate safeguards are in place to protect your information in accordance with applicable data
                protection laws.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h3>
              <p className="text-gray-700 mb-6">
                We retain your personal information for as long as necessary to provide our services and fulfill the
                purposes outlined in this policy. We may retain certain information for longer periods as required by
                law or for legitimate business purposes.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h3>
              <p className="text-gray-700 mb-6">
                Our services are not intended for individuals under the age of 18. We do not knowingly collect personal
                information from children under 18. If we become aware that we have collected personal information from
                a child under 18, we will take steps to delete such information.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h3>
              <p className="text-gray-700 mb-6">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                new policy on this page and updating the "Last Updated" date. We encourage you to review this policy
                periodically for any changes.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h3>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">privacy@bizzlink.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Globe className="w-5 h-5 text-gray-600 mt-1" />
                    <div className="text-gray-700">
                      <p>Bizzlink Privacy Team</p>
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
