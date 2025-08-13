import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function FreelancerEarningsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-8 w-32" />
                    </div>
                    <Skeleton className="w-12 h-12 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-28 mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>

        {/* Earnings List Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Skeleton className="w-5 h-5 rounded-full mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Skeleton className="h-6 w-64" />
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <Skeleton className="h-4 w-48 mb-1" />
                      <Skeleton className="h-4 w-72 mb-2" />
                      <div className="flex gap-4">
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="w-8 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
