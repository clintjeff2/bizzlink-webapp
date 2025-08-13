"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DollarSign,
  CreditCard,
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  AlertCircle,
  Receipt,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { useState } from "react"

const paymentsData = [
  {
    id: "PAY-001",
    projectId: 1,
    projectTitle: "E-commerce Website Development",
    freelancer: {
      name: "Sarah Chen",
      avatar: "/professional-woman-developer.png",
    },
    amount: 2200,
    type: "milestone",
    status: "completed",
    method: "Credit Card",
    date: "2024-01-28T10:30:00Z",
    description: "Frontend Development milestone payment",
    transactionId: "txn_1234567890",
    fees: 66,
    netAmount: 2134,
  },
  {
    id: "PAY-002",
    projectId: 1,
    projectTitle: "E-commerce Website Development",
    freelancer: {
      name: "Sarah Chen",
      avatar: "/professional-woman-developer.png",
    },
    amount: 1100,
    type: "milestone",
    status: "completed",
    method: "Bank Transfer",
    date: "2024-01-18T14:15:00Z",
    description: "Design & Planning milestone payment",
    transactionId: "txn_0987654321",
    fees: 33,
    netAmount: 1067,
  },
  {
    id: "PAY-003",
    projectId: 2,
    projectTitle: "Mobile App UI/UX Design",
    freelancer: {
      name: "Marcus Johnson",
      avatar: "/professional-man-designer.png",
    },
    amount: 800,
    type: "milestone",
    status: "completed",
    method: "PayPal",
    date: "2024-01-20T09:45:00Z",
    description: "Research & Wireframes milestone payment",
    transactionId: "txn_1122334455",
    fees: 24,
    netAmount: 776,
  },
  {
    id: "PAY-004",
    projectId: 4,
    projectTitle: "SEO & Content Marketing Campaign",
    freelancer: {
      name: "Elena Rodriguez",
      avatar: "/professional-woman-marketer.png",
    },
    amount: 4500,
    type: "full",
    status: "completed",
    method: "Credit Card",
    date: "2024-01-31T16:20:00Z",
    description: "Full project payment",
    transactionId: "txn_5566778899",
    fees: 135,
    netAmount: 4365,
  },
  {
    id: "PAY-005",
    projectId: 1,
    projectTitle: "E-commerce Website Development",
    freelancer: {
      name: "Sarah Chen",
      avatar: "/professional-woman-developer.png",
    },
    amount: 1650,
    type: "milestone",
    status: "pending",
    method: "Credit Card",
    date: "2024-02-10T12:00:00Z",
    description: "Backend Development milestone payment",
    transactionId: "txn_9988776655",
    fees: 49.5,
    netAmount: 1600.5,
  },
  {
    id: "PAY-006",
    projectId: 3,
    projectTitle: "Brand Identity Package",
    freelancer: {
      name: "Lisa Wang",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    amount: 600,
    type: "milestone",
    status: "failed",
    method: "Credit Card",
    date: "2024-02-05T11:30:00Z",
    description: "Logo Concepts milestone payment",
    transactionId: "txn_4433221100",
    fees: 18,
    netAmount: 582,
  },
]

export default function ClientPayments() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dateRange, setDateRange] = useState("all")

  const filteredPayments = paymentsData.filter((payment) => {
    const matchesSearch =
      payment.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    const matchesType = typeFilter === "all" || payment.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

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
        return <CheckCircle className="w-3 h-3" />
      case "pending":
        return <Clock className="w-3 h-3" />
      case "failed":
        return <AlertCircle className="w-3 h-3" />
      default:
        return <Receipt className="w-3 h-3" />
    }
  }

  const stats = {
    totalPaid: paymentsData.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0),
    totalFees: paymentsData.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.fees, 0),
    pendingPayments: paymentsData.filter((p) => p.status === "pending").length,
    completedPayments: paymentsData.filter((p) => p.status === "completed").length,
    thisMonth: paymentsData
      .filter((p) => {
        const paymentDate = new Date(p.date)
        const now = new Date()
        return (
          paymentDate.getMonth() === now.getMonth() &&
          paymentDate.getFullYear() === now.getFullYear() &&
          p.status === "completed"
        )
      })
      .reduce((sum, p) => sum + p.amount, 0),
    lastMonth: paymentsData
      .filter((p) => {
        const paymentDate = new Date(p.date)
        const lastMonth = new Date()
        lastMonth.setMonth(lastMonth.getMonth() - 1)
        return (
          paymentDate.getMonth() === lastMonth.getMonth() &&
          paymentDate.getFullYear() === lastMonth.getFullYear() &&
          p.status === "completed"
        )
      })
      .reduce((sum, p) => sum + p.amount, 0),
  }

  const monthlyChange = stats.lastMonth > 0 ? ((stats.thisMonth - stats.lastMonth) / stats.lastMonth) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Payment History</h1>
            <p className="text-gray-600 dark:text-gray-400">Track all your payments and transactions</p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Link href="/client/payments/methods">
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700">
                <CreditCard className="w-4 h-4 mr-2" />
                Payment Methods
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Paid</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    ${stats.totalPaid.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">All time</p>
                </div>
                <div className="p-3 bg-green-200 dark:bg-green-800 rounded-2xl">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">This Month</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    ${stats.thisMonth.toLocaleString()}
                  </p>
                  <div className="flex items-center text-xs">
                    {monthlyChange >= 0 ? (
                      <>
                        <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                        <span className="text-green-600">+{monthlyChange.toFixed(1)}%</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
                        <span className="text-red-600">{monthlyChange.toFixed(1)}%</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-blue-200 dark:bg-blue-800 rounded-2xl">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Completed</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.completedPayments}</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400">Transactions</p>
                </div>
                <div className="p-3 bg-purple-200 dark:bg-purple-800 rounded-2xl">
                  <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Total Fees</p>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                    ${stats.totalFees.toLocaleString()}
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">Platform fees</p>
                </div>
                <div className="p-3 bg-yellow-200 dark:bg-yellow-800 rounded-2xl">
                  <Receipt className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="milestone">Milestone</SelectItem>
                  <SelectItem value="full">Full Payment</SelectItem>
                  <SelectItem value="bonus">Bonus</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Payment Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Project & Freelancer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Receipt className="w-4 h-4 text-gray-400" />
                          {payment.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Image
                            src={payment.freelancer.avatar || "/placeholder.svg"}
                            alt={payment.freelancer.name}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">{payment.projectTitle}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{payment.freelancer.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            ${payment.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Fee: ${payment.fees}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {payment.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(payment.status)} border capitalize`}>
                          {getStatusIcon(payment.status)}
                          <span className="ml-1">{payment.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{payment.method}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {new Date(payment.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(payment.date).toLocaleTimeString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link href={`/client/payments/${payment.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredPayments.length === 0 && (
              <div className="text-center py-12">
                <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No payments found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                    ? "Try adjusting your filters to see more payments."
                    : "You haven't made any payments yet."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
