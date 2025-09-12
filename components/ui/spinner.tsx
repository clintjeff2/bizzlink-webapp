import { cn } from "@/lib/utils"

interface SpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

export function Spinner({ className, size = "md" }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-2",
    xl: "w-12 h-12 border-3",
  }

  return (
    <div className={cn(
      "border-t-transparent border-primary rounded-full animate-spin", 
      sizeClasses[size],
      className
    )}></div>
  )
}
