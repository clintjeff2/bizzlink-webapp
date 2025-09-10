import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading header */}
        <div className="mb-6">
          <div className="h-10 w-32 bg-slate-200 rounded animate-pulse mb-4"></div>
          <div className="h-8 bg-slate-200 w-1/3 rounded animate-pulse mb-2"></div>
          <div className="h-6 bg-slate-200 w-1/4 rounded animate-pulse"></div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Proposal details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Proposal Content Card */}
            <Card className="animate-pulse border-slate-200">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                <CardTitle className="flex items-center text-lg">
                  <div className="w-5 h-5 bg-slate-300 rounded mr-2"></div>
                  <div className="h-5 bg-slate-300 w-40 rounded"></div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
            
            {/* Project Summary Card */}
            <Card className="animate-pulse border-slate-200">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                <CardTitle className="flex items-center text-lg">
                  <div className="w-5 h-5 bg-slate-300 rounded mr-2"></div>
                  <div className="h-5 bg-slate-300 w-40 rounded"></div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column: Freelancer info and actions */}
          <div className="space-y-6">
            {/* Freelancer Card */}
            <Card className="animate-pulse border-slate-200">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                <CardTitle className="flex items-center text-lg">
                  <div className="w-5 h-5 bg-slate-300 rounded mr-2"></div>
                  <div className="h-5 bg-slate-300 w-28 rounded"></div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-slate-200 mb-4"></div>
                  <div className="h-5 bg-slate-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3 mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/3 mb-6"></div>
                  <div className="h-10 bg-slate-200 rounded w-full mb-3"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>

            {/* Proposal Details Card */}
            <Card className="animate-pulse border-slate-200">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                <CardTitle className="flex items-center text-lg">
                  <div className="w-5 h-5 bg-slate-300 rounded mr-2"></div>
                  <div className="h-5 bg-slate-300 w-36 rounded"></div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-8 bg-slate-200 rounded w-1/2 mb-1"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
                  <div className="h-5 bg-slate-200 rounded w-2/3 mb-1"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
            
            {/* Action Card */}
            <Card className="animate-pulse border-slate-200">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                <CardTitle className="flex items-center text-lg">
                  <div className="h-5 bg-slate-300 w-20 rounded"></div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-10 bg-slate-200 rounded w-full"></div>
                  <div className="h-10 bg-slate-200 rounded w-full"></div>
                  <div className="h-10 bg-slate-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
