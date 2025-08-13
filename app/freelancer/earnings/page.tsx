"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

interface Earning {
  id: string
  projectTitle: string
  clientName: string
  amount: number
  status: "completed" | "pending" | "processing"
  date: string
  type: "milestone" | "hourly" | "fixed" | "bonus"
  description: string
  invoiceNumber: string
}

const mockEarnings: Earning[] = [
  {
    id: "1",
    projectTitle: "E-commerce Website Development",
    clientName: "TechStart Inc.",
    amount: 2500,
    status: "completed",
    date: "2024-01-15",
    type: "milestone",
    description: "Milestone 2: Frontend Development Complete",
    invoiceNumber: "INV-2024-001",
  },
  {
    id: "2",
    projectTitle: "Mobile App UI/UX Design",
    clientName: "FitLife Co.",
    amount: 1800,
    status: "completed",
    date: "2024-01-12",
    type: "fixed",
    description: "Complete UI/UX Design Package",
    invoiceNumber: "INV-2024-002",
  },
  {
    id: "3",
    projectTitle: "Brand Identity Design",
    clientName: "StartupXYZ",
    amount: 1200,
    status: "processing",
    date: "2024-01-10",
    type: "milestone",
    description: "Milestone 1: Logo and Brand Guidelines",
    invoiceNumber: "INV-2024-003",
  },
  {
    id: "4",
    projectTitle: "SEO Campaign Management",
    clientName: "Digital Marketing Pro",
    amount: 800,
    status: "pending",
    date: "2024-01-08",
    type: "hourly",
    description: "40 hours @ $20/hour",
    invoiceNumber: "INV-2024-004",
  },
  {
    id: "5",
    projectTitle: "Data Analytics Dashboard",
    clientName: "DataCorp Solutions",
    amount: 3200,
    status: "completed",
    date: "2024-01-05",
    type: "fixed",
    description: "Complete Dashboard Development",
    invoiceNumber: "INV-2024-005",
  },
  {
    id: "6",
    projectTitle: "Content Writing Package",
    clientName: "BlogMaster Inc.",
    amount: 600,
    status: "completed",
    date: "2024-01-03",
    type: "fixed",
    description: "10 Blog Posts + SEO Optimization",
    invoiceNumber: "INV-2024-006",
  },
]

export default function FreelancerEarningsPage() {
  const [earnings, setEarnings] = useState(mockEarnings)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dateRange, setDateRange] = useState("all")

  const totalEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0)
  const completedEarnings = earnings
    .filter((e) => e.status === "completed")
    .reduce((sum, earning) => sum + earning.amount, 0)
  const pendingEarnings = earnings
    .filter((e) => e.status === "pending")
    .reduce((sum, earning) => sum + earning.amount, 0)
  const processingEarnings = earnings
    .filter((e) => e.status === "processing")
    .reduce((sum, earning) => sum + earning.amount, 0)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "processing":
        return <AlertCircle className="w-4 h-4 text-blue-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
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
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "milestone":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "hourly":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "fixed":
        return "bg-green-100 text-green-800 border-green-200"
      case "bonus":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredEarnings = earnings.filter((earning) => {
    const matchesSearch =
      earning.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      earning.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      earning.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || earning.status === statusFilter
    const matchesType = typeFilter === "all" || earning.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-600" />
                Earnings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Track your income and payment history</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filter
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Total Earnings</p>
                    <p className="text-2xl font-bold">${totalEarnings.toLocaleString()}</p>
                  </div>
                  <div className="bg-green-400/20 p-3 rounded-full">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-green-100">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span className="text-sm">+12% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Completed</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${completedEarnings.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-gray-600 dark:text-gray-400">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm">{earnings.filter((e) => e.status === "completed").length} payments</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Processing</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${processingEarnings.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                    <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm">
                    {earnings.filter((e) => e.status === "processing").length} in progress
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Pending</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${pendingEarnings.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
                    <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="text-sm">{earnings.filter((e) => e.status === "pending").length} awaiting</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search earnings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="milestone">Milestone</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="bonus">Bonus</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Date Range" />
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
        </div>

        {/* Earnings List */}
        <div className="space-y-4">
          {filteredEarnings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <DollarSign className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No earnings found</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  {searchTerm
                    ? "Try adjusting your search terms or filters"
                    : "Start working on projects to see your earnings here"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredEarnings.map((earning) => (
              <Card key={earning.id} className="transition-all duration-200 hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 mt-1">{getStatusIcon(earning.status)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {earning.projectTitle}
                          </h3>
                          <Badge variant="outline" className={getStatusColor(earning.status)}>
                            {earning.status}
                          </Badge>
                          <Badge variant="outline" className={getTypeColor(earning.type)}>
                            {earning.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Client: {earning.clientName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{earning.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                          <span>Invoice: {earning.invoiceNumber}</span>
                          <span>Date: {new Date(earning.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 ml-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          ${earning.amount.toLocaleString()}
                        </p>
                      </div>
                      <Link href={`/freelancer/earnings/${earning.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
