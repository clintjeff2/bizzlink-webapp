import { Navigation } from "@/components/navigation"

export default function FreelancerOnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation />
      <main className="pt-4">
        {children}
      </main>
    </div>
  )
}
