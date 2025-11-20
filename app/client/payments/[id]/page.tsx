"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DollarSign,
  CreditCard,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Receipt,
  Download,
  RefreshCw,
  ArrowLeft,
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  Shield,
  Zap,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { useParams } from "next/navigation"

// Mock data - in real app, this would come from API
const paymentData = {
  id: "PAY-001",
  transactionId: "txn_1234567890",
  projectId: 1,
  projectTitle: "E-commerce Website Development",
  freelancer: {
    id: 1,
    name: "Sarah Chen",
    avatar: "/professional-woman-developer.png",
    email: "sarah.chen@email.com",
    location: "San Francisco, CA",
    phone: "+1 (555) 123-4567",
  },
  amount: 2200,
  fees: 66,
  netAmount: 2134,
  type: "milestone",
  status: "completed",
  method: "Credit Card",
  cardLast4: "4242",
  cardBrand: "Visa",
  date: "2024-01-28T10:30:00Z",
  processedDate: "2024-01-28T10:32:15Z",
  description: "Frontend Development milestone payment",
  milestoneDetails: {
    name: "Frontend Development",
    description: "Develop the user interface using React and responsive design",
    deliverables: ["Homepage", "Product Pages", "Cart & Checkout", "User Dashboard"],
    dueDate: "2024-01-30",
    completedDate: "2024-01-28",
  },
  billing: {
    name: "John Smith",
    email: "john.smith@company.com",
    address: {
      line1: "123 Business Ave",
      line2: "Suite 100",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
    },
    company: "Tech Innovations Inc.",
  },
  timeline: [
    {
      id: 1,
      event: "Payment Initiated",
      description: "Payment request created for milestone completion",
      timestamp: "2024-01-28T10:30:00Z",
      status: "info",
    },
    {
      id: 2,
      event: "Payment Processing",
      description: "Payment is being processed by payment provider",
      timestamp: "2024-01-28T10:30:30Z",
      status: "info",
    },
    {
      id: 3,
      event: "Payment Authorized",
      description: "Payment method authorized successfully",
      timestamp: "2024-01-28T10:31:45Z",
      status: "success",
    },
    {
      id: 4,
      event: "Payment Completed",
      description: "Payment successfully transferred to freelancer",
      timestamp: "2024-01-28T10:32:15Z",
      status: "success",
    },
  ],
  receipt: {
    receiptNumber: "RCP-2024-001-28-001",
    issueDate: "2024-01-28",
    dueDate: "2024-01-28",
    items: [
      {
        description: "Frontend Development Milestone",
        quantity: 1,
        rate: 2200,
        amount: 2200,
      },
    ],
    subtotal: 2200,
    platformFee: 66,
    total: 2266,
    amountPaid: 2266,
  },
}

export default function PaymentDetail() {
  const params = useParams()
  const paymentId = params.id

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      case "refunded":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "failed":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Receipt className="w-4 h-4" />
    }
  }

  const getTimelineStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-600"
      case "warning":
        return "bg-yellow-100 text-yellow-600"
      case "error":
        return "bg-red-100 text-red-600"
      default:
        return "bg-blue-100 text-blue-600"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <Link href="/client/payments" className="hover:text-blue-600 flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Payment History
            </Link>
            <span>/</span>
            <span>{paymentData.id}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payment Details</h1>
                <Badge className={`${getStatusColor(paymentData.status)} border`}>
                  {getStatusIcon(paymentData.status)}
                  <span className="ml-1 capitalize">{paymentData.status}</span>
                </Badge>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{paymentData.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>Payment ID: {paymentData.id}</span>
                <span>•</span>
                <span>Transaction ID: {paymentData.transactionId}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4 lg:mt-0">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
              {paymentData.status === "failed" && (
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry Payment
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Payment Summary */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl">
                    <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-green-600 dark:text-green-400 mb-1">Amount Paid</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      ${paymentData.amount.toLocaleString()}
                    </p>
                  </div>

                  <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                    <Receipt className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Platform Fee</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">${paymentData.fees}</p>
                  </div>

                  <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
                    <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                    <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Net Amount</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      ${paymentData.netAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Payment Date</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(paymentData.date).toLocaleDateString()} at{" "}
                          {new Date(paymentData.date).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Payment Method</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {paymentData.cardBrand} •••• {paymentData.cardLast4}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Processed Date</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(paymentData.processedDate).toLocaleDateString()} at{" "}
                          {new Date(paymentData.processedDate).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                        <p className="font-medium text-gray-900 dark:text-white capitalize">
                          {paymentData.type} Payment
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project & Milestone Details */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Project & Milestone Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Project</h4>
                    <Link
                      href={`/client/projects/${paymentData.projectId}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {paymentData.projectTitle}
                    </Link>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Milestone</h4>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                        {paymentData.milestoneDetails.name}
                      </h5>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {paymentData.milestoneDetails.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Due Date</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {new Date(paymentData.milestoneDetails.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Completed Date</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {new Date(paymentData.milestoneDetails.completedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Deliverables</p>
                        <div className="flex flex-wrap gap-2">
                          {paymentData.milestoneDetails.deliverables.map((deliverable) => (
                            <Badge key={deliverable} variant="outline" className="text-xs">
                              {deliverable}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Timeline */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Payment Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {paymentData.timeline.map((event, index) => (
                    <div key={event.id} className="relative">
                      {index < paymentData.timeline.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200 dark:bg-gray-700"></div>
                      )}
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${getTimelineStatusColor(event.status)}`}>
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{event.event}</h4>
                          <p className="text-gray-600 dark:text-gray-400 mb-2">{event.description}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(event.timestamp).toLocaleDateString()} at{" "}
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Freelancer Info */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Freelancer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src={paymentData.freelancer.avatar || "/placeholder.svg"}
                    alt={paymentData.freelancer.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{paymentData.freelancer.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Freelancer</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{paymentData.freelancer.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{paymentData.freelancer.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{paymentData.freelancer.phone}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <Link href={`/freelancer/${paymentData.freelancer.id}`}>
                  <Button variant="outline" className="w-full bg-transparent">
                    <User className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Billing Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Billed To</p>
                    <p className="font-medium text-gray-900 dark:text-white">{paymentData.billing.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{paymentData.billing.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Company</p>
                    <p className="font-medium text-gray-900 dark:text-white">{paymentData.billing.company}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                    <div className="text-sm text-gray-900 dark:text-white">
                      <p>{paymentData.billing.address.line1}</p>
                      {paymentData.billing.address.line2 && <p>{paymentData.billing.address.line2}</p>}
                      <p>
                        {paymentData.billing.address.city}, {paymentData.billing.address.state}{" "}
                        {paymentData.billing.address.zip}
                      </p>
                      <p>{paymentData.billing.address.country}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Receipt Summary */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Receipt Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Receipt #</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {paymentData.receipt.receiptNumber}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Issue Date</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(paymentData.receipt.issueDate).toLocaleDateString()}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${paymentData.receipt.subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Platform Fee</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${paymentData.receipt.platformFee}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-gray-900 dark:text-white">${paymentData.receipt.total.toLocaleString()}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </Button>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Payment encrypted</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>PCI DSS compliant</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Fraud protection enabled</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
