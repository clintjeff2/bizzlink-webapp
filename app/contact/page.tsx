"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle,
  Globe,
  Users,
  Briefcase,
  HeadphonesIcon,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
} from "lucide-react"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const contactMethods = [
    {
      title: "Email Support",
      description: "Get detailed help via email",
      icon: Mail,
      contact: "support@bizzlink.com",
      availability: "24/7 - Response within 4 hours",
      color: "bg-blue-500",
    },
    {
      title: "Phone Support",
      description: "Speak with our support team",
      icon: Phone,
      contact: "+1 (555) 123-4567",
      availability: "Mon-Fri 9AM-6PM EST",
      color: "bg-green-500",
    },
    {
      title: "Live Chat",
      description: "Instant help through live chat",
      icon: MessageSquare,
      contact: "Available on website",
      availability: "24/7 - Average response < 2 min",
      color: "bg-purple-500",
    },
    {
      title: "Business Inquiries",
      description: "Partnerships and enterprise",
      icon: Briefcase,
      contact: "business@bizzlink.com",
      availability: "Mon-Fri 9AM-5PM EST",
      color: "bg-orange-500",
    },
  ]

  const offices = [
    {
      city: "New York",
      address: "123 Business Ave, Suite 100",
      zipCode: "New York, NY 10001",
      phone: "+1 (555) 123-4567",
      email: "ny@bizzlink.com",
    },
    {
      city: "San Francisco",
      address: "456 Tech Street, Floor 15",
      zipCode: "San Francisco, CA 94105",
      phone: "+1 (555) 987-6543",
      email: "sf@bizzlink.com",
    },
    {
      city: "London",
      address: "789 Innovation Road",
      zipCode: "London, UK EC1A 1BB",
      phone: "+44 20 7123 4567",
      email: "london@bizzlink.com",
    },
  ]

  const socialLinks = [
    { name: "Twitter", icon: Twitter, url: "https://twitter.com/bizzlink", color: "text-blue-400" },
    { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com/company/bizzlink", color: "text-blue-600" },
    { name: "Facebook", icon: Facebook, url: "https://facebook.com/bizzlink", color: "text-blue-700" },
    { name: "Instagram", icon: Instagram, url: "https://instagram.com/bizzlink", color: "text-pink-600" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
              Have questions, feedback, or need support? We're here to help you succeed on Bizzlink.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <MessageSquare className="w-5 h-5 mr-2" />
                Start Live Chat
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 text-gray-300 hover:bg-gray-300 hover:text-gray-900 bg-transparent"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Us Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Multiple Ways to Reach Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the contact method that works best for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <CardContent className="p-6">
                  <div
                    className={`w-16 h-16 ${method.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <method.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-gray-600 mb-4">{method.description}</p>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">{method.contact}</p>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{method.availability}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
            <p className="text-xl text-gray-600">
              Fill out the form below and we'll get back to you as soon as possible
            </p>
          </div>

          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName" className="text-base font-medium text-gray-900 mb-2 block">
                        First Name *
                      </Label>
                      <Input id="firstName" required className="h-12 text-base" placeholder="Enter your first name" />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-base font-medium text-gray-900 mb-2 block">
                        Last Name *
                      </Label>
                      <Input id="lastName" required className="h-12 text-base" placeholder="Enter your last name" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email" className="text-base font-medium text-gray-900 mb-2 block">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        className="h-12 text-base"
                        placeholder="Enter your email address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-base font-medium text-gray-900 mb-2 block">
                        Phone Number
                      </Label>
                      <Input id="phone" type="tel" className="h-12 text-base" placeholder="Enter your phone number" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="userType" className="text-base font-medium text-gray-900 mb-2 block">
                        I am a *
                      </Label>
                      <Select required>
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="client">Client looking to hire</SelectItem>
                          <SelectItem value="freelancer">Freelancer looking for work</SelectItem>
                          <SelectItem value="both">Both client and freelancer</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="subject" className="text-base font-medium text-gray-900 mb-2 block">
                        Subject *
                      </Label>
                      <Select required>
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="billing">Billing Question</SelectItem>
                          <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                          <SelectItem value="feedback">Feedback or Suggestion</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-base font-medium text-gray-900 mb-2 block">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      required
                      rows={6}
                      className="text-base"
                      placeholder="Please describe your inquiry in detail..."
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Minimum 50 characters. Be as specific as possible to help us assist you better.
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for contacting us. We've received your message and will get back to you within 4 hours.
                  </p>
                  <Button onClick={() => setIsSubmitted(false)} variant="outline">
                    Send Another Message
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Global Offices</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Visit us at one of our locations around the world</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span>{office.city}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-900 font-medium">{office.address}</p>
                      <p className="text-gray-600">{office.zipCode}</p>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{office.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{office.email}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media & Additional Info */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Connect With Us</h2>
          <p className="text-xl text-gray-600 mb-8">
            Follow us on social media for updates, tips, and community highlights
          </p>

          <div className="flex justify-center space-x-6 mb-12">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors duration-300 ${social.color}`}
              >
                <social.icon className="w-6 h-6" />
              </a>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Reach</h3>
              <p className="text-gray-600">Serving clients and freelancers in 150+ countries worldwide</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community First</h3>
              <p className="text-gray-600">Building a supportive community of 25,000+ active members</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeadphonesIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock assistance whenever you need help</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
