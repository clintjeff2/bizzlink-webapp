"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import {
  Bell,
  Search,
  Filter,
  CheckCircle,
  Trash2,
  Settings,
  Briefcase,
  DollarSign,
  MessageSquare,
  Users,
} from "lucide-react"

interface Notification {
  id: string
  type: "project" | "payment" | "message" | "system" | "proposal"
  title: string
  description: string
  timestamp: string
  read: boolean
  priority: "low" | "medium" | "high"
  actionUrl?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "proposal",
    title: "New Proposal Received",
    description: 'Sarah Chen submitted a proposal for your "E-commerce Website Development" project',
    timestamp: "2 minutes ago",
    read: false,
    priority: "high",
    actionUrl: "/client/projects/1/proposals",
  },
  {
    id: "2",
    type: "payment",
    title: "Payment Received",
    description: "$2,500 payment received for Mobile App Design project milestone 2",
    timestamp: "1 hour ago",
    read: false,
    priority: "high",
    actionUrl: "/freelancer/earnings/2",
  },
  {
    id: "3",
    type: "project",
    title: "Project Milestone Completed",
    description: "Milestone 2 has been marked as complete for SEO Campaign project",
    timestamp: "3 hours ago",
    read: true,
    priority: "medium",
    actionUrl: "/freelancer/contracts/3",
  },
  {
    id: "4",
    type: "message",
    title: "New Message",
    description: "Alex Rodriguez sent you a message about the Brand Identity project",
    timestamp: "5 hours ago",
    read: false,
    priority: "medium",
    actionUrl: "/messages/4",
  },
  {
    id: "5",
    type: "system",
    title: "Profile Update Required",
    description: "Please update your portfolio to maintain your Pro status",
    timestamp: "1 day ago",
    read: true,
    priority: "low",
    actionUrl: "/profile",
  },
  {
    id: "6",
    type: "project",
    title: "Project Deadline Reminder",
    description: "Data Analytics Dashboard project is due in 2 days",
    timestamp: "1 day ago",
    read: false,
    priority: "high",
    actionUrl: "/freelancer/contracts/6",
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "project":
        return <Briefcase className="w-5 h-5 text-blue-500" />
      case "payment":
        return <DollarSign className="w-5 h-5 text-green-500" />
      case "message":
        return <MessageSquare className="w-5 h-5 text-purple-500" />
      case "proposal":
        return <Users className="w-5 h-5 text-orange-500" />
      case "system":
        return <Settings className="w-5 h-5 text-gray-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.description.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "unread") return matchesSearch && !notification.read
    if (activeTab === "read") return matchesSearch && notification.read
    return matchesSearch && notification.type === activeTab
  })

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Bell className="w-8 h-8 text-blue-600" />
                Notifications
                {unreadCount > 0 && <Badge className="bg-red-500 text-white">{unreadCount}</Badge>}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Stay updated with your latest activities and important updates
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={markAllAsRead} variant="outline" size="sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:grid-cols-7">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="project">Projects</TabsTrigger>
            <TabsTrigger value="payment">Payments</TabsTrigger>
            <TabsTrigger value="message">Messages</TabsTrigger>
            <TabsTrigger value="proposal">Proposals</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No notifications found</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    {searchTerm ? "Try adjusting your search terms" : "You're all caught up!"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-all duration-200 hover:shadow-md ${
                    !notification.read ? "border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                              {notification.title}
                            </h3>
                            {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                            <Badge variant="outline" className={`text-xs ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{notification.description}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">{notification.timestamp}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {notification.actionUrl && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button variant="outline" size="sm" asChild>
                          <a href={notification.actionUrl}>View Details</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
