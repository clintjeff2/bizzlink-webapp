"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import {
  DollarSign,
  Calendar,
  User,
  FileText,
  Download,
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Building,
  Mail,
  Phone,
  Globe,
  CreditCard,
  Receipt,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface EarningDetail {
  id: string
  projectTitle: string
  projectDescription: string
  clientName: string
  clientCompany: string
  clientEmail: string
  clientPhone: string
  clientWebsite: string
  amount: number
  status: "completed" | "pending" | "processing"
  date: string
  dueDate: string
  type: "milestone" | "hourly" | "fixed" | "bonus"
  description: string
  invoiceNumber: string
  paymentMethod: string
  transactionId: string
  milestones: {
    id: string
    title: string
    description: string
    amount: number
    status: "completed" | "pending" | "in-progress"
    completedDate?: string
  }[]
  workDetails: {
    hoursWorked?: number
    hourlyRate?: number
    startDate: string
    endDate: string
    deliverables: string[]
  }
  timeline: {
    date: string
    event: string
    description: string
  }[]
}

const mockEarningDetail: EarningDetail = {
  id: "1",
  projectTitle: "E-commerce Website Development",
  projectDescription:
    "Complete development of a modern e-commerce platform with React, Node.js, and MongoDB. Includes user authentication, payment processing, inventory management, and admin dashboard.",
  clientName: "Sarah Johnson",
  clientCompany: "TechStart Inc.",
  clientEmail: "sarah@techstart.com",
  clientPhone: "+1 (555) 123-4567",
  clientWebsite: "https://techstart.com",
  amount: 2500,
  status: "completed",
  date: "2024-01-15",
  dueDate: "2024-01-20",
  type: "milestone",
  description: "Milestone 2: Frontend Development Complete",
  invoiceNumber: "INV-2024-001",
  paymentMethod: "Bank Transfer",
  transactionId: "TXN-789456123",
  milestones: [
    {
      id: "1",
      title: "Project Setup & Planning",
      description: "Initial project setup, requirements analysis, and technical planning",
      amount: 800,
      status: "completed",
      completedDate: "2023-12-15",
    },
    {
      id: "2",
      title: "Frontend Development",
      description: "Complete frontend development with React and responsive design",
      amount: 2500,
      status: "completed",
      completedDate: "2024-01-15",
    },
    {
      id: "3",
      title: "Backend Development",
      description: "API development, database setup, and server configuration",
      amount: 2200,
      status: "in-progress",
    },
    {
      id: "4",
      title: "Testing & Deployment",
      description: "Quality assurance, testing, and production deployment",
      amount: 1000,
      status: "pending",
    },
  ],
  workDetails: {
    hoursWorked: 125,
    hourlyRate: 20,
    startDate: "2023-12-01",
    endDate: "2024-01-15",
    deliverables: [
      "Responsive React frontend",
      "User authentication system",
      "Product catalog with search",
      "Shopping cart functionality",
      "Payment integration setup",
      "Admin dashboard mockups",
    ],
  },
  timeline: [
    {
      date: "2024-01-15",
      event: "Payment Completed",
      description: "Payment of $2,500 received via bank transfer",
    },
    {
      date: "2024-01-14",
      event: "Milestone Approved",
      description: "Client approved milestone 2 deliverables",
    },
    {
      date: "2024-01-12",
      event: "Work Submitted",
      description: "Frontend development completed and submitted for review",
    },
    {
      date: "2023-12-20",
      event: "Milestone Started",
      description: "Started working on frontend development milestone",
    },
  ],
}

export default function EarningDetailPage() {
  const params = useParams()
  const [earning] = useState<EarningDetail>(mockEarningDetail)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "processing":
        return <AlertCircle className="w-5 h-5 text-blue-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "in-progress":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getMilestoneStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "in-progress":
        return <AlertCircle className="w-4 h-4 text-blue-500" />
      case "pending":
        return <Clock className="w-4 h-4 text-gray-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/freelancer/earnings">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Earnings
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-600" />
                Earning Details
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Invoice #{earning.invoiceNumber}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Invoice
              </Button>
              <Button variant="outline" size="sm">
                <Receipt className="w-4 h-4 mr-2" />
                Receipt
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getStatusIcon(earning.status)}
                    {earning.projectTitle}
                  </span>
                  <Badge variant="outline" className={getStatusColor(earning.status)}>
                    {earning.status}
                  </Badge>
                </CardTitle>
                <CardDescription>{earning.projectDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">${earning.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Amount Earned</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-lg font-semibold text-blue-600">{new Date(earning.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Payment Date</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-lg font-semibold text-purple-600 capitalize">{earning.type}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Payment Type</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Work Details */}
            <Card>
              <CardHeader>
                <CardTitle>Work Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Work Period</Label>
                    <p className="text-sm">
                      {new Date(earning.workDetails.startDate).toLocaleDateString()} -{" "}
                      {new Date(earning.workDetails.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  {earning.workDetails.hoursWorked && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Hours Worked</Label>
                      <p className="text-sm">{earning.workDetails.hoursWorked} hours</p>
                    </div>
                  )}
                  {earning.workDetails.hourlyRate && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Hourly Rate</Label>
                      <p className="text-sm">${earning.workDetails.hourlyRate}/hour</p>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                    Deliverables
                  </Label>
                  <ul className="space-y-1">
                    {earning.workDetails.deliverables.map((deliverable, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {deliverable}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Project Milestones */}
            <Card>
              <CardHeader>
                <CardTitle>Project Milestones</CardTitle>
                <CardDescription>Track progress across all project milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earning.milestones.map((milestone, index) => (
                    <div key={milestone.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0 mt-1">{getMilestoneStatusIcon(milestone.status)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{milestone.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getStatusColor(milestone.status)}>
                              {milestone.status}
                            </Badge>
                            <span className="font-semibold">${milestone.amount.toLocaleString()}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{milestone.description}</p>
                        {milestone.completedDate && (
                          <p className="text-xs text-gray-500">
                            Completed: {new Date(milestone.completedDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earning.timeline.map((event, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{event.event}</h4>
                          <span className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</Label>
                  <p className="font-medium">{earning.clientName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Company</Label>
                  <p className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    {earning.clientCompany}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</Label>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {earning.clientEmail}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</Label>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {earning.clientPhone}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Website</Label>
                  <p className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <a
                      href={earning.clientWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {earning.clientWebsite}
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Payment Method</Label>
                  <p className="font-medium">{earning.paymentMethod}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Transaction ID</Label>
                  <p className="font-mono text-sm">{earning.transactionId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Invoice Number</Label>
                  <p className="font-medium">{earning.invoiceNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Due Date</Label>
                  <p>{new Date(earning.dueDate).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-transparent" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  <Receipt className="w-4 h-4 mr-2" />
                  View Receipt
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Tax Document
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>
}
