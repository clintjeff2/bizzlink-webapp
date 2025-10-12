"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  Search,
  Star,
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Globe,
  Shield,
  Zap,
  Award,
  MessageSquare,
  Clock,
  CheckCircle2,
  Sparkles,
  CreditCard,
  UserCheck,
  Send,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Layers,
  LucideIcon,
  FileText,
  HeartHandshake,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  getFeaturedFreelancers,
  getLatestProjects,
  getCategoryMetrics,
  getPlatformStats,
  getTimeAgo,
  getBudgetRangeString,
} from "@/lib/services/landingPageService";
import { User, Project } from "@/lib/redux/types/firebaseTypes";

// Testimonial Card Design 1
function TestimonialCard1({ quote, name, role, image, rating, colorScheme }) {
  return (
    <div className="relative group transform transition-transform duration-500 hover:scale-105 flex-shrink-0">
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r from-${colorScheme}-500 to-${
          colorScheme === "emerald"
            ? "cyan"
            : colorScheme === "blue"
            ? "indigo"
            : "blue"
        }-500 rounded-3xl blur opacity-0 group-hover:opacity-70 transition duration-300`}
      ></div>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl relative border border-gray-100 dark:border-gray-700 h-full flex flex-col">
        <div className="flex-1">
          <div
            className={`w-10 h-10 rounded-full bg-${colorScheme}-100 dark:bg-${colorScheme}-900/50 flex items-center justify-center mb-6`}
          >
            <svg
              width="21"
              height="16"
              viewBox="0 0 21 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`text-${colorScheme}-600`}
            >
              <path
                d="M7.9 8.24C8.14 7.64 8.5 7.12 8.98 6.68C9.4309 6.23736 9.97483 5.90774 10.57 5.72C11.553 5.45112 12.5963 5.43118 13.59 5.66C13.7865 5.69901 13.9921 5.67544 14.1722 5.59301C14.3523 5.51058 14.4969 5.37386 14.58 5.2C14.8678 4.64436 14.9312 4.00249 14.76 3.4C14.6543 3.05302 14.462 2.74347 14.2023 2.50038C13.9425 2.25729 13.6238 2.09017 13.28 2.02C12.5563 1.82122 11.7976 1.82122 11.074 2.02C10.325 2.18 9.651 2.5 9.054 2.98C8.45666 3.44664 7.94329 4.01622 7.54 4.66C6.69996 5.93218 6.27525 7.44838 6.33 8.98C6.33 9.04 6.33 9.1 6.33 9.16C6.40671 9.63173 6.70268 10.0444 7.124 10.28C7.53599 10.5113 8.02434 10.5386 8.46 10.354C8.85262 10.1999 9.15703 9.88121 9.29 9.476C9.42297 9.07079 9.37271 8.62499 9.15 8.256L7.9 8.24ZM16.9 8.24C17.14 7.64 17.5 7.12 17.98 6.68C18.4309 6.23736 18.9748 5.90774 19.57 5.72C20.553 5.45112 21.5963 5.43118 22.59 5.66C22.7865 5.69901 22.9921 5.67544 23.1722 5.59301C23.3523 5.51058 23.4969 5.37386 23.58 5.2C23.8678 4.64436 23.9312 4.00249 23.76 3.4C23.6543 3.05302 23.462 2.74347 23.2023 2.50038C22.9425 2.25729 22.6238 2.09017 22.28 2.02C21.5563 1.82122 20.7976 1.82122 20.074 2.02C19.325 2.18 18.651 2.5 18.054 2.98C17.4567 3.44664 16.9433 4.01622 16.54 4.66C15.7 5.93218 15.2753 7.44838 15.33 8.98C15.33 9.04 15.33 9.1 15.33 9.16C15.4067 9.63173 15.7027 10.0444 16.124 10.28C16.536 10.5113 17.0243 10.5386 17.46 10.354C17.8526 10.1999 18.157 9.88121 18.29 9.476C18.423 9.07079 18.3727 8.62499 18.15 8.256L16.9 8.24Z"
                fill="currentColor"
              />
            </svg>
          </div>

          <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed mb-8">
            {quote}
          </p>
        </div>

        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-white shadow-md">
            <Image
              src={image}
              alt={name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p
              className={`font-semibold text-gray-900 dark:text-white group-hover:text-${colorScheme}-600 transition-colors`}
            >
              {name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
          </div>
          <div className="ml-auto flex">
            {Array(rating)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 text-${colorScheme}-500 fill-current`}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Testimonial Card Design 2
function TestimonialCard2({ quote, name, role, image, rating, colorScheme }) {
  return (
    <div className="relative group transform transition-transform duration-500 hover:scale-105 flex-shrink-0">
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r from-${colorScheme}-500 to-${
          colorScheme === "emerald"
            ? "cyan"
            : colorScheme === "blue"
            ? "indigo"
            : "blue"
        }-500 rounded-3xl blur opacity-0 group-hover:opacity-70 transition duration-300`}
      ></div>
      <div
        className={`bg-gradient-to-br from-${colorScheme}-50/80 to-white dark:from-gray-800 dark:to-gray-900 p-8 rounded-3xl shadow-xl relative border border-${colorScheme}-100/50 dark:border-gray-700 h-full flex flex-col`}
      >
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div className="flex">
              {Array(rating)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 text-${colorScheme}-500 fill-current`}
                  />
                ))}
            </div>

            <div
              className={`text-5xl leading-none text-${colorScheme}-200 opacity-50 font-serif`}
            >
              "
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            {quote}
          </p>
        </div>

        <div className="flex items-center pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4 ring-2 ring-white dark:ring-gray-800 shadow-md">
            <Image
              src={image}
              alt={name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">{name}</p>
            <p
              className={`text-sm text-${colorScheme}-600 dark:text-${colorScheme}-400`}
            >
              {role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Testimonial Card Design 3
function TestimonialCard3({ quote, name, role, image, rating, colorScheme }) {
  return (
    <div className="relative group transform transition-transform duration-500 hover:scale-105 flex-shrink-0">
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r from-${colorScheme}-500 to-${
          colorScheme === "emerald"
            ? "cyan"
            : colorScheme === "blue"
            ? "indigo"
            : "blue"
        }-500 rounded-3xl blur opacity-0 group-hover:opacity-70 transition duration-300`}
      ></div>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl relative border border-gray-100 dark:border-gray-700 h-full flex flex-col">
        <div className="flex-1">
          <div
            className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-${colorScheme}-100 to-transparent dark:from-${colorScheme}-900/30 dark:to-transparent rounded-bl-3xl rounded-tr-3xl`}
          ></div>

          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-br from-${colorScheme}-500 to-${
              colorScheme === "emerald"
                ? "cyan-500"
                : colorScheme === "blue"
                ? "indigo-500"
                : "blue-500"
            } flex items-center justify-center mb-6 shadow-lg`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5 text-white"
            >
              <path
                fill="currentColor"
                d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144C8.97 4.222 8.737 4.278 8.472 4.345c-.271.05-.56.187-.882.312C7.272 4.799 6.904 4.895 6.562 5.123c-.344.218-.741.4-1.091.692C5.132 6.116 4.723 6.377 4.421 6.76c-.33.358-.656.734-.909 1.162C3.219 8.33 3.02 8.778 2.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C2.535 17.474 4.338 19 6.5 19c2.485 0 4.5-2.015 4.5-4.5S8.985 10 6.5 10zM17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L20.758 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162C14.219 8.33 14.02 8.778 13.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C13.535 17.474 15.338 19 17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10z"
              />
            </svg>
          </div>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            {quote}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className={`w-12 h-12 rounded-xl overflow-hidden mr-4 ring-2 ring-${colorScheme}-500/20`}
            >
              <Image
                src={image}
                alt={name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">{name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
            </div>
          </div>
          <div
            className={`px-4 py-1.5 bg-${colorScheme}-50 text-${colorScheme}-700 dark:bg-${colorScheme}-900/30 dark:text-${colorScheme}-300 rounded-full text-xs font-medium`}
          >
            Verified Client
          </div>
        </div>
      </div>
    </div>
  );
}

// We'll load these dynamically from Firebase
const initialCategories = [
  {
    name: "Web Development",
    count: "2,847",
    icon: "💻",
    color: "bg-blue-50 text-blue-600",
  },
  {
    name: "Mobile Apps",
    count: "1,923",
    icon: "📱",
    color: "bg-green-50 text-green-600",
  },
  {
    name: "UI/UX Design",
    count: "3,156",
    icon: "🎨",
    color: "bg-pink-50 text-pink-600",
  },
  {
    name: "Digital Marketing",
    count: "2,234",
    icon: "📈",
    color: "bg-orange-50 text-orange-600",
  },
  {
    name: "Content Writing",
    count: "1,876",
    icon: "✍️",
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    name: "Data Science",
    count: "987",
    icon: "📊",
    color: "bg-blue-50 text-blue-600",
  },
];

// Initial placeholder stats until we load from Firebase
const initialStats = [
  {
    label: "Active Freelancers",
    value: "50,000+",
    icon: Users,
    color: "text-blue-600",
  },
  {
    label: "Projects Completed",
    value: "125,000+",
    icon: Briefcase,
    color: "text-green-600",
  },
  {
    label: "Total Earnings",
    value: "$45M+",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    label: "Client Satisfaction",
    value: "98.5%",
    icon: TrendingUp,
    color: "text-orange-600",
  },
];

// How Bizzlink works process steps
const howItWorksSteps = [
  {
    title: "Post Your Project",
    description: "Describe your project requirements, budget, and timeline",
    icon: Layers,
    color: "bg-blue-500",
  },
  {
    title: "Review Proposals",
    description: "Freelancers submit tailored proposals for your review",
    icon: CheckCircle2,
    color: "bg-green-500",
  },
  {
    title: "Chat & Select",
    description: "Interview candidates and choose the perfect match",
    icon: MessageSquare,
    color: "bg-purple-500",
  },
  {
    title: "Secure Payment",
    description: "Funds are securely held in escrow until work is approved",
    icon: CreditCard,
    color: "bg-amber-500",
  },
  {
    title: "Work Delivery",
    description: "Freelancer completes milestones and delivers quality work",
    icon: Briefcase,
    color: "bg-pink-500",
  },
  {
    title: "Release Payment",
    description: "Review and approve work to release payment to freelancer",
    icon: Send,
    color: "bg-teal-500",
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [featuredFreelancers, setFeaturedFreelancers] = useState<User[]>([]);
  const [latestProjects, setLatestProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState(initialCategories);
  const [stats, setStats] = useState(initialStats);
  const [isLoading, setIsLoading] = useState(true);

  // Testimonial carousel state
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);

  // Testimonials data
  const testimonials = [
    {
      quote:
        "Bizzlink completely transformed how I run my business. I found amazing developers who delivered exactly what I needed, on time and within budget.",
      name: "Sarah Thompson",
      role: "CEO, DigitalFirst",
      image: "/business-client.png",
      rating: 5,
      colorScheme: "emerald",
    },
    {
      quote:
        "As a UX designer, Bizzlink has helped me connect with incredible clients. The platform's ease of use and project management tools are simply outstanding.",
      name: "Michael Reynolds",
      role: "Senior UX Designer",
      image: "/professional-man-designer.png",
      rating: 5,
      colorScheme: "blue",
    },
    {
      quote:
        "The caliber of talent on Bizzlink is unmatched. We've hired multiple developers who have become integral to our product development.",
      name: "Elena Vega",
      role: "Product Manager, TechCorp",
      image: "/professional-woman-marketer.png",
      rating: 5,
      colorScheme: "cyan",
    },
    {
      quote:
        "Finding quality content writers was always a challenge until I discovered Bizzlink. Now we have an amazing team of writers delivering consistent content.",
      name: "Robert Kim",
      role: "Marketing Director, ContentLabs",
      image: "/middle-eastern-data-scientist.png",
      rating: 5,
      colorScheme: "indigo",
    },
    {
      quote:
        "The vetting process for freelancers ensures I only work with the best clients. The escrow payment system gives me confidence and security.",
      name: "Priya Sharma",
      role: "Full Stack Developer",
      image: "/professional-woman-developer.png",
      rating: 5,
      colorScheme: "emerald",
    },
    {
      quote:
        "From website redesign to ongoing maintenance, Bizzlink has been our go-to platform for finding specialized development talent.",
      name: "Thomas Wright",
      role: "COO, GrowthMax",
      image: "/placeholder-user.jpg",
      rating: 5,
      colorScheme: "blue",
    },
  ];

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-advance carousel on mobile
  useEffect(() => {
    if (isMobile) {
      const interval = setInterval(() => {
        setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isMobile, testimonials.length]);

  // Carousel navigation functions
  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  // Load data from Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Fetch freelancers and projects in parallel
        const [freelancersData, projectsData, categoryData, statsData] =
          await Promise.all([
            getFeaturedFreelancers(6),
            getLatestProjects(3),
            getCategoryMetrics(),
            getPlatformStats(),
          ]);

        setFeaturedFreelancers(freelancersData);
        setLatestProjects(projectsData);
        setCategories(categoryData);

        // Map icon strings to actual Lucide icons
        const mappedStats = statsData.map((stat) => {
          let icon;
          switch (stat.icon) {
            case "Users":
              icon = Users;
              break;
            case "Briefcase":
              icon = Briefcase;
              break;
            case "DollarSign":
              icon = DollarSign;
              break;
            case "TrendingUp":
              icon = TrendingUp;
              break;
            default:
              icon = Briefcase;
          }
          return { ...stat, icon };
        });

        setStats(mappedStats);
      } catch (error) {
        console.error("Error loading landing page data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (user) {
      switch (user.role) {
        case "admin":
          window.location.href = "/admin";
          break;
        case "client":
          window.location.href = "/client/dashboard";
          break;
        case "freelancer":
          window.location.href = "/freelancer/dashboard";
          break;
      }
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 lg:pt-36 lg:pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-500/5 to-green-500/10"></div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.15'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              backgroundSize: "80px 80px",
            }}
          ></div>
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            {/* Left Content */}
            <div className="max-w-2xl lg:max-w-3xl mb-16 lg:mb-0">
              <div
                className={`transition-all duration-1000 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 mb-6 py-2 px-4 text-sm rounded-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  The Future of Work is Here
                </Badge>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-8">
                  Connect with <span className="text-blue-600">Expert</span>
                  <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                    Freelancers
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-2xl">
                  Transform your ideas into reality with the perfect talent.
                  Find vetted experts or exciting opportunities on the leading
                  freelance marketplace.
                </p>

                {/* Search Bar */}
                <div className="relative max-w-xl mb-10">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search for services (e.g., web development, logo design...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-36 py-7 text-lg border-2 border-gray-200 rounded-full focus:border-blue-500 focus:ring-0 shadow-lg"
                  />
                  <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-8 py-6 text-base font-medium">
                    Search
                  </Button>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-5 items-center">
                  <Link href="/projects" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto font-medium text-base"
                    >
                      <Briefcase className="w-5 h-5 mr-3" />
                      Find Work
                    </Button>
                  </Link>
                  <Link href="/freelancers" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-transparent w-full sm:w-auto font-medium text-base"
                    >
                      <Users className="w-5 h-5 mr-3" />
                      Hire Talent
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div
              className={`transition-all duration-1000 delay-500 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              } relative lg:w-1/2`}
            >
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-48 h-48 bg-green-400 rounded-full opacity-20 animate-pulse"></div>
                <div
                  className="absolute -bottom-8 -right-8 w-36 h-36 bg-blue-400 rounded-full opacity-20 animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute top-40 right-40 w-24 h-24 bg-purple-400 rounded-full opacity-20 animate-pulse"
                  style={{ animationDelay: "2s" }}
                ></div>

                <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <Image
                    src="/modern-saas-office.png"
                    alt="Bizzlink - Freelance Marketplace"
                    width={700}
                    height={500}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>

                {/* Stats Overlays */}
                <div className="absolute top-5 -left-5 bg-white p-4 rounded-xl shadow-xl flex items-center z-20 transform -rotate-6">
                  <div className="bg-green-100 p-3 rounded-lg mr-3">
                    <CheckCircle2 className="h-7 w-7 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Completed Projects
                    </p>
                    <p className="font-bold text-gray-900 text-lg">125,000+</p>
                  </div>
                </div>

                <div className="absolute bottom-10 -right-6 bg-white p-4 rounded-xl shadow-xl flex items-center z-20 transform rotate-3">
                  <div className="bg-blue-100 p-3 rounded-lg mr-3">
                    <UserCheck className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Verified Freelancers
                    </p>
                    <p className="font-bold text-gray-900 text-lg">50,000+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted By Section */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="text-center">
            <p className="text-base text-gray-500 uppercase tracking-wider font-semibold mb-16">
              Trusted by leading brands
            </p>
            <div className="flex flex-wrap justify-center items-center gap-10 opacity-75">
              <div className="w-28 h-14 flex items-center justify-center">
                <Image
                  src="/images/microsoft-logo.png"
                  alt="Microsoft"
                  width={100}
                  height={35}
                />
              </div>
              <div className="w-28 h-14 flex items-center justify-center">
                <Image
                  src="/images/google-logo.png"
                  alt="Google"
                  width={100}
                  height={35}
                />
              </div>
              <div className="w-28 h-14 flex items-center justify-center">
                <Image
                  src="/images/airbnb-logo.png"
                  alt="Airbnb"
                  width={100}
                  height={35}
                />
              </div>
              <div className="w-28 h-14 flex items-center justify-center">
                <Image
                  src="/images/netflix-logo.svg"
                  alt="Netflix"
                  width={100}
                  height={35}
                />
              </div>
              <div className="w-28 h-14 flex items-center justify-center">
                <Image
                  src="/images/shopify-logo.png"
                  alt="Shopify"
                  width={100}
                  height={35}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Animated background with brand colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-blue-600 to-cyan-500"></div>

        {/* Dynamic pattern overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 15% 50%, rgba(0, 255, 200, 0.15) 0%, transparent 25%), 
                            radial-gradient(circle at 85% 30%, rgba(0, 150, 255, 0.2) 0%, transparent 33%)`,
          }}
        ></div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10 backdrop-blur-sm"
              style={{
                width: `${Math.random() * 80 + 40}px`,
                height: `${Math.random() * 80 + 40}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${
                  Math.random() * 10 + 15
                }s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.5 + 0.2,
              }}
            ></div>
          ))}
        </div>

        {/* Light beam effects */}
        <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-b from-white/10 via-transparent to-transparent transform -skew-x-12 opacity-30"></div>
        <div className="absolute top-0 right-1/4 w-1/3 h-full bg-gradient-to-b from-cyan-300/20 via-transparent to-transparent transform skew-x-12 opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-4 md:mb-6 relative">
              <div className="absolute inset-0 bg-white/20 blur-xl rounded-full transform scale-150 -z-10"></div>
              <Badge className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-white py-2 px-4 sm:px-6 rounded-full border border-white/30 shadow-lg shadow-emerald-500/20 text-sm sm:text-base">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Platform Stats
              </Badge>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 tracking-tight drop-shadow-md px-2">
              The{" "}
              <span className="relative inline-block">
                Leading
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-cyan-400"></span>
              </span>{" "}
              Freelance Marketplace
            </h2>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed px-4">
              Join thousands of businesses and professionals already using our
              platform
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group text-center relative overflow-hidden"
              >
                {/* Glass card with dynamic gradient border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400 via-blue-500 to-cyan-400 animate-pulse opacity-70 blur-md group-hover:opacity-90 transition-all duration-500"></div>

                <div className="relative h-full bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md p-4 sm:p-6 lg:p-8 rounded-2xl border border-white/30 group-hover:border-white/50 transition-all duration-300 transform hover:translate-y-[-8px] hover:shadow-2xl shadow-xl shadow-emerald-500/10 z-10">
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <div className="p-3 sm:p-4 lg:p-6 rounded-full bg-gradient-to-br from-white/20 to-white/5 group-hover:from-white/30 group-hover:to-white/10 transition-all duration-300 shadow-lg">
                      <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white drop-shadow-md" />
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-2 sm:mb-3 tracking-tight drop-shadow-sm">
                    {stat.value}
                  </div>
                  <div className="text-white/90 text-sm sm:text-base lg:text-lg font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Decorative accent line */}
          <div className="mt-16 h-1 w-1/3 mx-auto bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"></div>
        </div>

        {/* Add custom animation */}
        <style jsx global>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-25px) rotate(5deg);
            }
          }
        `}</style>
      </section>

      {/* Categories Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Advanced geometric background */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-slate-50 to-cyan-50"></div>

        {/* Dynamic pattern with Bizzlink colors */}
        <div className="absolute inset-0">
          <svg
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 1440 800"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient
                id="category-grad1"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient
                id="category-grad2"
                x1="100%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.07" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.07" />
              </linearGradient>
            </defs>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#category-grad1)"
            />
            <circle cx="400" cy="200" r="300" fill="url(#category-grad2)" />
            <circle cx="1200" cy="600" r="250" fill="url(#category-grad1)" />
            <path
              d="M0,800 C600,650 800,450 1440,800"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeOpacity="0.05"
            />
            <path
              d="M0,600 C400,500 900,600 1440,500"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="2"
              strokeOpacity="0.05"
            />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-300 to-blue-300 rounded-full opacity-20 blur-xl transform scale-150"></div>
              <Badge className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-2.5 px-6 rounded-full border border-emerald-200/30 shadow-lg shadow-emerald-500/10">
                <Briefcase className="w-4 h-4 mr-2" />
                Service Categories
              </Badge>
            </div>
            <h2 className="text-3xl md:text-6xl font-bold mb-6 tracking-tight">
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-300/20 to-blue-300/20 blur-lg rounded-lg transform scale-110"></span>
                <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-blue-600 to-cyan-600">
                  Explore Popular Categories
                </span>
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover thousands of services across various categories and find
              the perfect match for your project
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {categories.map((category, index) => (
              <Link
                href={`/projects?category=${encodeURIComponent(category.name)}`}
                key={index}
              >
                <div className="group relative transform transition-all duration-500 hover:scale-[1.03]">
                  {/* Animated background glow */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-70 transition duration-500 group-hover:duration-200"></div>

                  <Card className="relative h-full bg-gradient-to-br from-white to-gray-50/90 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl overflow-hidden border-0">
                    {/* Decorative accent */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>

                    {/* Animated hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <CardContent className="p-8 relative z-10">
                      <div className="flex items-center justify-between mb-8">
                        {/* Category icon with enhanced styling */}
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/20 to-cyan-300/20 rounded-2xl blur-md transform scale-110"></div>
                          <div
                            className={`relative text-5xl p-5 rounded-2xl ${category.color
                              .replace(
                                "bg-blue-50",
                                "bg-gradient-to-br from-emerald-50 to-cyan-50"
                              )
                              .replace(
                                "text-blue-600",
                                "text-emerald-600"
                              )} shadow-lg border border-emerald-100/50`}
                          >
                            {category.icon}
                          </div>
                        </div>

                        {/* Enhanced arrow button */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-cyan-100 flex items-center justify-center group-hover:from-emerald-500 group-hover:to-cyan-500 transition-all duration-500 shadow-md group-hover:shadow-lg">
                          <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors" />
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors">
                        {category.name}
                      </h3>

                      <p className="text-gray-600 mb-7">
                        <span className="font-semibold text-emerald-600">
                          {category.count}
                        </span>{" "}
                        services available
                      </p>

                      <div className="mt-auto pt-6 border-t border-emerald-100/50">
                        <span className="text-sm bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent font-medium flex items-center">
                          Browse Category
                          <span className="relative ml-2 group-hover:ml-4 transition-all duration-300">
                            <ChevronRight className="w-5 h-5 text-emerald-500" />
                          </span>
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Projects Section */}
      <section className="py-28 relative overflow-hidden">
        {/* Dynamic 3D background with Bizzlink colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-cyan-50"></div>

        {/* Mesh gradient background */}
        <div className="absolute inset-0">
          <svg
            className="w-full h-full opacity-30"
            viewBox="0 0 1000 1000"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="project-grad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.7" />
              </linearGradient>
              <filter id="goo">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="20"
                  result="blur"
                />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -15"
                  result="goo"
                />
              </filter>
            </defs>
            <g filter="url(#goo)">
              <circle cx="200" cy="200" r="100" fill="url(#project-grad)" />
              <circle cx="800" cy="800" r="150" fill="url(#project-grad)" />
              <circle cx="500" cy="300" r="80" fill="url(#project-grad)" />
              <circle cx="300" cy="700" r="120" fill="url(#project-grad)" />
              <circle cx="900" cy="300" r="70" fill="url(#project-grad)" />
            </g>
          </svg>
        </div>

        {/* Animated lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute h-px w-full top-1/4 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent animate-pulse"
            style={{ animationDuration: "4s" }}
          ></div>
          <div
            className="absolute h-px w-full top-2/4 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-pulse"
            style={{ animationDuration: "6s", animationDelay: "1s" }}
          ></div>
          <div
            className="absolute h-px w-full top-3/4 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-pulse"
            style={{ animationDuration: "5s", animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            {/* Glowing badge with shadow effect */}
            <div className="inline-block mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-cyan-400/30 blur-xl rounded-full"></div>
              <Badge className="relative bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 py-2.5 px-8 rounded-full shadow-lg shadow-emerald-500/20 border border-white/20">
                <Briefcase className="w-4 h-4 mr-2" />
                New Opportunities
              </Badge>
            </div>

            {/* Enhanced heading with 3D text effect */}
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight relative">
              <span className="absolute inset-x-0 top-1/2 h-12 bg-gradient-to-r from-emerald-200/30 via-blue-200/30 to-cyan-200/30 blur-lg transform -translate-y-1/2"></span>
              <span className="relative">
                Latest Project{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-blue-600 to-cyan-600 drop-shadow-sm">
                  Opportunities
                </span>
              </span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Fresh projects posted by clients looking for talented freelancers
              — start your next successful collaboration today
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-12">
              {[1, 2, 3].map((item) => (
                <div key={item} className="relative group">
                  {/* Shimmer effect */}
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full animate-shimmer"
                    style={{ animationDuration: "1.5s" }}
                  ></div>

                  <div className="bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm rounded-3xl shadow-xl border border-emerald-100/30 overflow-hidden">
                    <div className="p-8">
                      <div className="animate-pulse">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
                          <div className="h-8 bg-gradient-to-r from-emerald-100/70 to-cyan-100/70 rounded-lg w-2/5 mb-3 lg:mb-0"></div>
                          <div className="flex items-center space-x-6">
                            <div className="h-5 bg-gradient-to-r from-emerald-100/70 to-cyan-100/70 rounded-lg w-28"></div>
                            <div className="h-5 bg-gradient-to-r from-emerald-100/70 to-cyan-100/70 rounded-lg w-32"></div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                          <div className="flex items-center mb-4 sm:mb-0">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-100/70 to-cyan-100/70 mr-4"></div>
                            <div>
                              <div className="h-4 bg-gradient-to-r from-emerald-100/70 to-cyan-100/70 rounded-lg w-20 mb-2"></div>
                              <div className="h-5 bg-gradient-to-r from-emerald-100/70 to-cyan-100/70 rounded-lg w-32"></div>
                            </div>
                          </div>
                          <div>
                            <div className="h-4 bg-gradient-to-r from-emerald-100/70 to-cyan-100/70 rounded-lg w-16 mb-2"></div>
                            <div className="h-7 bg-gradient-to-r from-emerald-100/70 to-cyan-100/70 rounded-lg w-28"></div>
                          </div>
                        </div>

                        <div className="h-16 bg-gradient-to-r from-emerald-100/70 to-cyan-100/70 rounded-lg mb-6"></div>

                        <div className="flex flex-wrap gap-2 mb-6">
                          <div className="h-7 bg-gradient-to-r from-emerald-100/70 to-cyan-100/70 rounded-full w-20"></div>
                          <div className="h-7 bg-gradient-to-r from-emerald-100/70 to-cyan-100/70 rounded-full w-24"></div>
                          <div className="h-7 bg-gradient-to-r from-emerald-100/70 to-cyan-100/70 rounded-full w-16"></div>
                          <div className="h-7 bg-gradient-to-r from-emerald-100/70 to-cyan-100/70 rounded-full w-20"></div>
                        </div>

                        <div className="h-px bg-gradient-to-r from-emerald-100/30 via-cyan-100/30 to-emerald-100/30 w-full my-4"></div>

                        <div className="flex justify-between items-center">
                          <div className="h-5 bg-gradient-to-r from-emerald-100/70 to-cyan-100/70 rounded-lg w-28"></div>
                          <div className="h-6 bg-gradient-to-r from-emerald-100/70 to-cyan-100/70 rounded-lg w-32"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-14">
              {latestProjects.map((project) => (
                <Link
                  href={`/projects/${project.projectId}`}
                  key={project.projectId}
                >
                  <div className="relative group transform transition-all duration-500 hover:scale-[1.02] mt-8">
                    {/* Glowing effect on hover */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur opacity-0 group-hover:opacity-40 transition duration-300"></div>

                    {/* Main card */}
                    <div className="relative bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-emerald-100/30 overflow-hidden group-hover:border-emerald-200/50 transition-all duration-500">
                      {/* 3D layered decorative top */}
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-cyan-500"></div>
                      <div className="absolute top-2 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-blue-400 to-cyan-400 opacity-60"></div>

                      <div className="p-8 relative">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                          <div className="flex items-center mb-3 lg:mb-0">
                            <h3 className="text-2xl font-bold text-gray-900 mr-4 group-hover:text-emerald-600 transition-colors">
                              {project.title}
                            </h3>
                            {project.timeline?.isUrgent && (
                              <Badge className="bg-gradient-to-r from-red-100 to-orange-100 text-red-600 hover:bg-red-100 py-1 px-3 rounded-full shadow-sm border border-red-200/50">
                                <Clock className="w-3 h-3 mr-1" /> Urgent
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-6 text-sm">
                            <span className="flex items-center text-gray-600">
                              <MessageSquare className="w-4 h-4 mr-2 text-emerald-500" />
                              {project.proposalCount || 0} proposals
                            </span>
                            <span className="flex items-center text-gray-600">
                              <Clock className="w-4 h-4 mr-2 text-emerald-500" />
                              {getTimeAgo(
                                project.publishedAt || project.createdAt
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Client info panel with enhanced glass effect */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 bg-gradient-to-br from-emerald-50/80 to-cyan-50/80 backdrop-blur-sm p-6 rounded-2xl shadow-inner border border-emerald-100/30">
                          <div className="flex items-center mb-4 sm:mb-0">
                            <div className="flex-shrink-0 mr-4 relative">
                              {/* Avatar glow effect */}
                              <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/30 to-cyan-300/30 rounded-full blur-md transform scale-110"></div>
                              <Image
                                src={
                                  project.clientInfo?.photoURL ||
                                  "/placeholder-user.jpg"
                                }
                                alt={project.clientInfo?.name || "Client"}
                                width={56}
                                height={56}
                                className="relative w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                              />
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">
                                Posted by
                              </span>
                              <h4 className="font-semibold text-gray-900 flex items-center">
                                {project.clientInfo?.name || "Client"}
                                {project.clientInfo?.verificationStatus && (
                                  <CheckCircle2 className="inline-block w-4 h-4 ml-1 text-emerald-500" />
                                )}
                              </h4>
                            </div>
                          </div>

                          {/* Budget card with enhanced styling */}
                          <div className="bg-white py-3 px-5 rounded-xl shadow-md border border-emerald-100/30 group-hover:border-emerald-200/50 transition-all">
                            <div className="text-sm text-gray-600 mb-1">
                              Budget
                            </div>
                            <div className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                              {getBudgetRangeString(project)}
                            </div>
                          </div>
                        </div>

                        {/* Project description with subtle background */}
                        <div className="mb-6 bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl">
                          <p className="text-gray-700 line-clamp-2 leading-relaxed">
                            {project.description}
                          </p>
                        </div>

                        {/* Skills badges with enhanced styling */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.requirements?.skills
                            .slice(0, 4)
                            .map((skill, index) => (
                              <Badge
                                key={index}
                                className="bg-gradient-to-r from-emerald-50 to-cyan-50 text-emerald-700 hover:from-emerald-100 hover:to-cyan-100 py-1.5 px-4 rounded-full border border-emerald-100/30 shadow-sm"
                              >
                                {skill}
                              </Badge>
                            ))}
                          {(project.requirements?.skills.length || 0) > 4 && (
                            <Badge className="bg-gray-50 text-gray-700 hover:bg-gray-100 py-1.5 px-4 rounded-full border border-gray-100/50 shadow-sm">
                              +{(project.requirements?.skills.length || 0) - 4}{" "}
                              more
                            </Badge>
                          )}
                        </div>

                        {/* Bottom section with enhanced elements */}
                        <div className="flex justify-between items-center pt-4 border-t border-emerald-50">
                          {/* Experience level badge */}
                          <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm border border-emerald-100/30">
                            {project.requirements?.experienceLevel
                              .charAt(0)
                              .toUpperCase() +
                              project.requirements?.experienceLevel.slice(
                                1
                              )}{" "}
                            level
                          </div>

                          {/* CTA with animated arrow */}
                          <div className="flex items-center text-emerald-600 font-medium">
                            View Project Details
                            <span className="relative transition-all duration-300 ml-1 group-hover:ml-3">
                              <div className="absolute inset-0 bg-emerald-100 rounded-full opacity-0 group-hover:opacity-30 scale-0 group-hover:scale-100 transition-all duration-300"></div>
                              <ArrowRight className="relative w-5 h-5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Add shimmer animation */}
          <style jsx global>{`
            @keyframes shimmer {
              100% {
                transform: translateX(100%);
              }
            }
            .animate-shimmer {
              animation: shimmer 1.5s infinite;
            }
          `}</style>

          <div className="text-center mt-20">
            <Link href="/projects">
              <div className="relative inline-block group">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-full opacity-70 blur-md group-hover:opacity-100 transition-all duration-500 group-hover:blur-lg"></div>

                <Button
                  size="lg"
                  className="relative bg-gradient-to-r from-emerald-600 via-blue-600 to-cyan-600 hover:from-emerald-700 hover:via-blue-700 hover:to-cyan-700 text-white px-16 py-8 rounded-full shadow-2xl hover:shadow-emerald-400/20 font-semibold text-lg transform transition-all duration-300 hover:scale-[1.03] border border-white/10"
                >
                  <span className="flex items-center">
                    Browse All Projects
                    <span className="relative ml-2 transition-all duration-500 group-hover:ml-4">
                      <div className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:opacity-30 scale-0 group-hover:scale-100 transition-all duration-300"></div>
                      <ArrowRight className="relative w-6 h-6" />
                    </span>
                  </span>
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section - New Visual Workflow */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 opacity-80"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full opacity-40 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-100 rounded-full opacity-40 translate-x-1/3 translate-y-1/3"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-200 py-2 px-4">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Your Journey with Bizzlink
            </Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              How Bizzlink Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our seamless platform connects clients with top freelancers,
              ensuring quality work delivery with secure payment protection
            </p>
          </div>

          {/* Interactive Visual Workflow - Improved Version */}
          <div className="relative mb-28">
            {/* Central Flow Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full transform -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {howItWorksSteps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Connection Dots (Visible on mobile) */}
                  {index < howItWorksSteps.length - 1 && (
                    <div className="md:hidden absolute top-full left-1/2 w-0.5 h-8 bg-gradient-to-b from-purple-500 to-blue-500 transform -translate-x-1/2"></div>
                  )}

                  {/* Card */}
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 relative z-10 h-full hover:shadow-2xl hover:border-blue-100 transition-all duration-300 flex flex-col items-center transform hover:-translate-y-2">
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-white flex items-center justify-center border-4 border-gray-100 z-20">
                      <div
                        className={`w-10 h-10 ${step.color} rounded-full flex items-center justify-center`}
                      >
                        <step.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <div className="mt-6 text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {step.description}
                      </p>
                    </div>

                    {/* Visual Image for each step */}
                    <div className="mt-6 w-full h-32 bg-gray-50 rounded-xl overflow-hidden">
                      <Image
                        src={
                          index === 0
                            ? "/food-delivery-app-screen.png"
                            : index === 1
                            ? "/marketing-campaign-results.png"
                            : index === 2
                            ? "/images/chat-interface.webp"
                            : index === 3
                            ? "/images/payment-escrow.webp"
                            : index === 4
                            ? "/mobile-banking-app.png"
                            : "/data-analytics-dashboard.png"
                        }
                        alt={step.title}
                        width={200}
                        height={120}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Step Number */}
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gray-900 text-white text-sm flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Platform Workflow Visualization */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-5 p-8 lg:p-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-8">
                  The Complete Bizzlink Experience
                </h3>

                <div className="space-y-10">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">
                        Client Posts a Project
                      </h4>
                      <p className="text-gray-600">
                        Clients detail their project requirements, budget, and
                        timeline. Our intelligent matching system immediately
                        starts identifying suitable freelancers.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mr-4">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">
                        Freelancers Submit Proposals
                      </h4>
                      <p className="text-gray-600">
                        Qualified freelancers review the project and submit
                        customized proposals highlighting their relevant skills
                        and approach to the project.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mr-4">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">
                        Secure Payment & Delivery
                      </h4>
                      <p className="text-gray-600">
                        Once hired, clients fund the project securely through
                        our escrow system. Payment is only released when the
                        client approves the completed work.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-gradient-to-br from-blue-500 to-purple-600 p-8 lg:p-0 relative">
                <div className="h-full w-full flex items-center justify-center overflow-hidden">
                  <div className="relative w-full max-w-3xl p-8">
                    {/* Process Flow Diagram */}
                    <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
                        <div className="text-center p-4 rounded-xl bg-white/10">
                          <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4">
                            <Layers className="w-8 h-8" />
                          </div>
                          <h5 className="font-semibold text-lg mb-2">
                            Project Posting
                          </h5>
                          <div className="text-sm opacity-90">
                            Client defines requirements
                          </div>
                        </div>

                        <div className="relative text-center p-4 rounded-xl bg-white/10">
                          <div className="hidden md:block absolute -left-4 top-1/2 w-4 h-0.5 bg-white/60 transform -translate-y-1/2"></div>
                          <div className="hidden md:block absolute -right-4 top-1/2 w-4 h-0.5 bg-white/60 transform -translate-y-1/2"></div>
                          <div className="w-16 h-16 mx-auto bg-purple-600 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare className="w-8 h-8" />
                          </div>
                          <h5 className="font-semibold text-lg mb-2">
                            Collaboration
                          </h5>
                          <div className="text-sm opacity-90">
                            Messaging & milestone tracking
                          </div>
                        </div>

                        <div className="text-center p-4 rounded-xl bg-white/10">
                          <div className="w-16 h-16 mx-auto bg-green-600 rounded-full flex items-center justify-center mb-4">
                            <CreditCard className="w-8 h-8" />
                          </div>
                          <h5 className="font-semibold text-lg mb-2">
                            Project Completion
                          </h5>
                          <div className="text-sm opacity-90">
                            Approval & secure payment
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex justify-center">
                        <Image
                          src="/general-dashboard-interface.png"
                          alt="Bizzlink Dashboard Interface"
                          width={600}
                          height={300}
                          className="w-full max-w-lg rounded-xl shadow-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid - Professional Version */}
          <div className="relative z-10 py-16">
            {/* Advanced 3D Background */}
            <div className="absolute inset-0 z-0">
              {/* Main gradient background with depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-white to-blue-50/80"></div>

              {/* Glass morphic shapes */}
              <div className="absolute top-0 left-10 w-72 h-72 bg-gradient-to-br from-emerald-300/10 to-cyan-300/5 rounded-full backdrop-blur-3xl"></div>
              <div className="absolute bottom-0 right-10 w-80 h-80 bg-gradient-to-tr from-blue-300/10 to-emerald-300/5 rounded-full backdrop-blur-3xl"></div>

              {/* Subtle moving highlight */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-full h-1/3 top-1/3 bg-gradient-to-r from-transparent via-emerald-100/30 to-transparent opacity-40 transform -skew-y-6"></div>
                <div className="absolute w-full h-1/3 top-1/2 bg-gradient-to-r from-transparent via-blue-100/20 to-transparent opacity-30 transform skew-y-3"></div>
              </div>

              {/* Professional mesh grid pattern */}
              <svg
                className="absolute inset-0 w-full h-full opacity-[0.015]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id="grid-pattern"
                    patternUnits="userSpaceOnUse"
                    width="30"
                    height="30"
                  >
                    <path
                      d="M 30 0 L 0 0 0 30"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      strokeOpacity="0.8"
                      className="text-emerald-900"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
              </svg>
            </div>

            {/* Section header with professional styling */}
            <div className="relative z-10 text-center mb-20">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100 shadow-sm mb-6">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mr-2">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-medium bg-gradient-to-r from-emerald-700 to-cyan-700 bg-clip-text text-transparent">
                  Premium Platform Features
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                <span className="relative">
                  <span className="absolute -left-2 -right-2 top-1/2 h-3 bg-emerald-100/50 rounded transform -translate-y-1/2 -rotate-1"></span>
                  <span className="relative">Why Businesses & Freelancers</span>
                </span>{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Choose Bizzlink
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Our platform combines cutting-edge technology with user-centered
                design to deliver an unmatched experience for both clients and
                freelancers
              </p>
            </div>

            {/* Features Grid with professional layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Secure Payments Feature */}
              <div className="group relative bg-gradient-to-br from-white/60 to-white border border-emerald-100/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                {/* Hover accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                {/* Interior highlight effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative p-8">
                  {/* Icon with professional styling */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-8 shadow-lg shadow-emerald-200/50 group-hover:shadow-emerald-300/50 transition-all duration-500">
                    <Shield className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors duration-300">
                    Secure Escrow Payments
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-6">
                    Your payment is held safely in our bank-level secure escrow
                    system until you verify and approve the completed work,
                    protecting both parties throughout the transaction.
                  </p>

                  {/* Feature benefits with icons */}
                  <ul className="space-y-3">
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-emerald-500 flex-shrink-0" />
                      <span>Bank-level encryption and security</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-emerald-500 flex-shrink-0" />
                      <span>Multiple payment options available</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-emerald-500 flex-shrink-0" />
                      <span>Milestone-based release system</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Fast Delivery Feature */}
              <div className="group relative bg-gradient-to-br from-white/60 to-white border border-blue-100/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                {/* Hover accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                {/* Interior highlight effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative p-8">
                  {/* Icon with professional styling */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-8 shadow-lg shadow-blue-200/50 group-hover:shadow-blue-300/50 transition-all duration-500">
                    <Zap className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    Efficient Delivery System
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-6">
                    Our advanced project management system ensures on-time
                    delivery with transparent milestone tracking, real-time
                    updates, and clear communication channels.
                  </p>

                  {/* Feature benefits with icons */}
                  <ul className="space-y-3">
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                      <span>Real-time progress visualization</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                      <span>Automated deadline reminders</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                      <span>Integrated delivery confirmation</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Quality Guaranteed Feature */}
              <div className="group relative bg-gradient-to-br from-white/60 to-white border border-cyan-100/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 lg:mt-8">
                {/* Hover accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                {/* Interior highlight effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative p-8">
                  {/* Icon with professional styling */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mb-8 shadow-lg shadow-cyan-200/50 group-hover:shadow-cyan-300/50 transition-all duration-500">
                    <Award className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-cyan-600 transition-colors duration-300">
                    Quality Assurance
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-6">
                    Access our exclusive network of pre-vetted, top-tier
                    freelancers with verified skills, portfolios, and track
                    records of delivering exceptional results.
                  </p>

                  {/* Feature benefits with icons */}
                  <ul className="space-y-3">
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-cyan-500 flex-shrink-0" />
                      <span>Rigorous freelancer verification</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-cyan-500 flex-shrink-0" />
                      <span>Skill assessment and testing</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-cyan-500 flex-shrink-0" />
                      <span>Transparent rating system</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Secondary features row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
              {/* Simplified feature highlights */}
              <div className="bg-white/60 backdrop-blur-sm border border-gray-100 rounded-xl p-6 shadow-md flex items-start">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Smart Messaging
                  </h4>
                  <p className="text-sm text-gray-600">
                    Real-time communication with translation and file sharing
                    capabilities
                  </p>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-sm border border-gray-100 rounded-xl p-6 shadow-md flex items-start">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Contract Protection
                  </h4>
                  <p className="text-sm text-gray-600">
                    Legally binding agreements with transparent terms and
                    conditions
                  </p>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-sm border border-gray-100 rounded-xl p-6 shadow-md flex items-start">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <HeartHandshake className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    24/7 Support
                  </h4>
                  <p className="text-sm text-gray-600">
                    Dedicated customer success team available around the clock
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive feature highlight */}
            <div className="relative z-10 max-w-5xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-br from-emerald-600/95 to-blue-600/95 rounded-2xl overflow-hidden shadow-2xl">
                <div className="relative py-12 px-8 md:py-16 md:px-12">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <svg
                      width="100%"
                      height="100%"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <pattern
                          id="dotted-pattern"
                          width="20"
                          height="20"
                          patternUnits="userSpaceOnUse"
                        >
                          <circle cx="10" cy="10" r="1" fill="white" />
                        </pattern>
                      </defs>
                      <rect
                        width="100%"
                        height="100%"
                        fill="url(#dotted-pattern)"
                      />
                    </svg>
                  </div>

                  <div className="relative">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-8 md:mb-0 md:mr-8 md:max-w-xl">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                          Ready to experience the Bizzlink difference?
                        </h3>
                        <p className="text-white/80">
                          Join thousands of businesses and freelancers who are
                          already benefiting from our premium platform features.
                        </p>
                      </div>

                      <div className="flex space-x-4">
                        <Button
                          size="lg"
                          className="bg-white hover:bg-gray-50 text-emerald-600 font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                        >
                          Post a Project
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          className="border-white text-emerald-600 hover:bg-white/10 font-medium px-6 py-3 rounded-xl"
                        >
                          Find Work
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Enhanced Version */}
      <section className="py-32 relative overflow-hidden">
        {/* Advanced background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white"></div>
        <div className="absolute inset-0">
          <svg
            className="absolute inset-0 w-full h-full opacity-30"
            viewBox="0 0 1000 1000"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="testimonial-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path d="M0 0h40v40H0z" fill="none" />
                <circle
                  cx="20"
                  cy="20"
                  r="1"
                  fill="#10b981"
                  fillOpacity="0.3"
                />
              </pattern>
              <linearGradient
                id="testimonial-glow"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#testimonial-grid)" />
            <rect width="100%" height="100%" fill="url(#testimonial-glow)" />
          </svg>
        </div>

        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-gradient-to-br from-emerald-200 to-cyan-200 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-200 to-blue-200 opacity-20 blur-3xl"></div>

        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-20">
            <div className="text-center mb-12 md:mb-16 relative">
              {/* Enhanced badge with glow */}
              <div className="inline-flex relative mb-4 md:mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full opacity-25 blur-xl transform scale-150"></div>
                <Badge className="relative bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-2 sm:py-3 px-4 sm:px-6 md:px-8 rounded-full border border-emerald-200/30 shadow-lg text-sm sm:text-base">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 fill-white" />
                  Success Stories
                </Badge>
              </div>

              {/* 3D text effect for heading */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 tracking-tight relative px-4">
                <span className="inline-block relative">
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 blur-lg opacity-30 transform scale-110"></span>
                  <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 drop-shadow-sm">
                    What Our Community Says
                  </span>
                </span>
              </h2>

              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                Discover why thousands of clients and freelancers trust Bizzlink
                for their professional needs
              </p>
            </div>

            {/* Responsive Testimonials Display */}
            {isMobile ? (
              // Mobile Carousel
              <div className="relative">
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${
                        currentTestimonialIndex * 100
                      }%)`,
                    }}
                  >
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className="w-full flex-shrink-0 px-4">
                        <TestimonialCard1
                          quote={testimonial.quote}
                          name={testimonial.name}
                          role={testimonial.role}
                          image={testimonial.image}
                          rating={testimonial.rating}
                          colorScheme={testimonial.colorScheme}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Carousel Controls */}
                <div className="flex justify-between items-center mt-6">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevTestimonial}
                    className="h-10 w-10 rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>

                  <div className="flex space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonialIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentTestimonialIndex
                            ? "bg-white scale-125"
                            : "bg-white/50 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextTestimonial}
                    className="h-10 w-10 rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ) : (
              // Desktop Marquees (Hidden on mobile)
              <div className="space-y-16">
                {/* First marquee - left to right */}
                <div className="relative">
                  <div className="absolute left-0 top-1/2 w-24 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
                  <div className="absolute right-0 top-1/2 w-24 h-full bg-gradient-to-l from-white to-transparent z-10"></div>

                  <div className="overflow-hidden relative">
                    <div className="marquee-container flex animate-marquee-slow">
                      {/* First set of testimonials */}
                      <TestimonialCard1
                        quote="Bizzlink completely transformed how I run my business. I found amazing developers who delivered exactly what I needed, on time and within budget."
                        name="Sarah Thompson"
                        role="CEO, DigitalFirst"
                        image="/business-client.png"
                        rating={5}
                        colorScheme="emerald"
                      />
                      <TestimonialCard2
                        quote="As a UX designer, Bizzlink has helped me connect with incredible clients. The platform's ease of use and project management tools are simply outstanding."
                        name="Michael Reynolds"
                        role="Senior UX Designer"
                        image="/professional-man-designer.png"
                        rating={5}
                        colorScheme="blue"
                      />
                      <TestimonialCard3
                        quote="The caliber of talent on Bizzlink is unmatched. We've hired multiple developers who have become integral to our product development."
                        name="Elena Vega"
                        role="Product Manager, TechCorp"
                        image="/professional-woman-marketer.png"
                        rating={5}
                        colorScheme="cyan"
                      />
                      <TestimonialCard1
                        quote="Finding quality content writers was always a challenge until I discovered Bizzlink. Now we have an amazing team of writers delivering consistent content."
                        name="Robert Kim"
                        role="Marketing Director, ContentLabs"
                        image="/middle-eastern-data-scientist.png"
                        rating={5}
                        colorScheme="indigo"
                      />
                      <TestimonialCard2
                        quote="The vetting process for freelancers ensures I only work with the best clients. The escrow payment system gives me confidence and security."
                        name="Priya Sharma"
                        role="Full Stack Developer"
                        image="/professional-woman-developer.png"
                        rating={5}
                        colorScheme="emerald"
                      />
                      <TestimonialCard3
                        quote="From website redesign to ongoing maintenance, Bizzlink has been our go-to platform for finding specialized development talent."
                        name="Thomas Wright"
                        role="COO, GrowthMax"
                        image="/placeholder-user.jpg"
                        rating={5}
                        colorScheme="blue"
                      />
                      <TestimonialCard1
                        quote="I've tripled my freelancing income since joining Bizzlink. The platform connects me with serious clients looking for quality work."
                        name="Marcus Johnson"
                        role="UI/UX Designer"
                        image="/professional-black-designer.png"
                        rating={5}
                        colorScheme="cyan"
                      />
                      <TestimonialCard2
                        quote="The talent on Bizzlink is outstanding. We've built an entire development team through the platform and have seen incredible results."
                        name="David Chen"
                        role="CTO, TechInnovate"
                        image="/tech-startup-office.png"
                        rating={5}
                        colorScheme="indigo"
                      />
                      <TestimonialCard3
                        quote="My marketing agency has grown 200% since we started hiring specialized freelancers through Bizzlink. Incredible platform!"
                        name="Jennifer Lopez"
                        role="Founder, MarketingPro"
                        image="/latina-marketer.png"
                        rating={5}
                        colorScheme="emerald"
                      />
                      <TestimonialCard1
                        quote="Bizzlink's AI-powered matching system connected me with the perfect data scientist for our complex analytics project."
                        name="Alex Morgan"
                        role="Head of Data, Analytix"
                        image="/placeholder-user.jpg"
                        rating={5}
                        colorScheme="blue"
                      />
                    </div>
                  </div>
                </div>

                {/* Second marquee - right to left */}
                <div className="relative">
                  <div className="absolute left-0 top-1/2 w-24 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
                  <div className="absolute right-0 top-1/2 w-24 h-full bg-gradient-to-l from-white to-transparent z-10"></div>

                  <div className="overflow-hidden relative">
                    <div className="marquee-container flex animate-marquee-reverse-slow">
                      {/* Second set of testimonials */}
                      <TestimonialCard3
                        quote="Bizzlink's milestone payment system gives me peace of mind. I know exactly when I'll get paid for completed work."
                        name="Jason Wu"
                        role="Mobile Developer"
                        image="/asian-mobile-developer.png"
                        rating={5}
                        colorScheme="emerald"
                      />
                      <TestimonialCard2
                        quote="Our company saved 40% on development costs by hiring specialized freelancers through Bizzlink instead of full-time staff."
                        name="Rachel Green"
                        role="CFO, StartupBoost"
                        image="/placeholder-user.jpg"
                        rating={5}
                        colorScheme="blue"
                      />
                      <TestimonialCard1
                        quote="The collaboration tools make working with remote freelancers seamless. It's as effective as having an in-house team."
                        name="Daniel Martinez"
                        role="Project Manager, WebSolutions"
                        image="/placeholder-user.jpg"
                        rating={5}
                        colorScheme="cyan"
                      />
                      <TestimonialCard3
                        quote="I found my dream clients on Bizzlink - they value quality work and provide clear requirements, making my job so much easier."
                        name="Michelle Lee"
                        role="Content Strategist"
                        image="/professional-woman-writer.png"
                        rating={5}
                        colorScheme="indigo"
                      />
                      <TestimonialCard2
                        quote="Bizzlink's verification system ensures I'm working with legitimate clients. No more payment issues or scams like on other platforms."
                        name="Kevin Thompson"
                        role="DevOps Engineer"
                        image="/placeholder-user.jpg"
                        rating={5}
                        colorScheme="emerald"
                      />
                      <TestimonialCard1
                        quote="We needed specialized AI expertise for a short-term project. Bizzlink connected us with a Ph.D. expert within 48 hours."
                        name="Sophia Chen"
                        role="Innovation Director, FutureTech"
                        image="/placeholder-user.jpg"
                        rating={5}
                        colorScheme="blue"
                      />
                      <TestimonialCard3
                        quote="The quality of work I receive through Bizzlink freelancers consistently exceeds my expectations. Worth every penny."
                        name="James Wilson"
                        role="E-commerce Owner"
                        image="/local-business.png"
                        rating={5}
                        colorScheme="cyan"
                      />
                      <TestimonialCard2
                        quote="As a data scientist, Bizzlink helps me find challenging projects that enhance my portfolio and connect me with industry leaders."
                        name="Omar Farooq"
                        role="Data Scientist"
                        image="/middle-eastern-data-scientist.png"
                        rating={5}
                        colorScheme="indigo"
                      />
                      <TestimonialCard1
                        quote="Our app development timeline was cut in half thanks to the specialized talent we sourced through Bizzlink's platform."
                        name="Lisa Johnson"
                        role="Mobile App Founder"
                        image="/placeholder-user.jpg"
                        rating={5}
                        colorScheme="emerald"
                      />
                      <TestimonialCard3
                        quote="The seamless communication tools make working with international clients a breeze. No more timezone headaches!"
                        name="Wei Zhang"
                        role="Backend Developer"
                        image="/placeholder-user.jpg"
                        rating={5}
                        colorScheme="blue"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats overlay banner */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="relative overflow-hidden">
              {/* Glowing background */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 to-cyan-600/90 rounded-2xl md:rounded-3xl"></div>

              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-10">
                <svg
                  width="100%"
                  height="100%"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern
                      id="testimonial-dots"
                      width="20"
                      height="20"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="10" cy="10" r="1" fill="white" />
                    </pattern>
                  </defs>
                  <rect
                    width="100%"
                    height="100%"
                    fill="url(#testimonial-dots)"
                  />
                </svg>
              </div>

              {/* Glass card */}
              <div className="relative backdrop-blur-sm p-6 sm:p-8 md:p-12 rounded-2xl md:rounded-3xl border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-center">
                  <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-xl md:rounded-2xl border border-white/20">
                    <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                      98%
                    </div>
                    <div className="text-white/90 text-sm sm:text-base">
                      Client Satisfaction
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-xl md:rounded-2xl border border-white/20">
                    <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                      12,000+
                    </div>
                    <div className="text-white/90 text-sm sm:text-base">
                      Successful Projects
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-xl md:rounded-2xl border border-white/20">
                    <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                      4.9/5
                    </div>
                    <div className="text-white/90 text-sm sm:text-base">
                      Average Rating
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add required styles and components */}
        <style jsx global>{`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-100% / 2));
            }
          }

          @keyframes marquee-reverse {
            0% {
              transform: translateX(calc(-100% / 2));
            }
            100% {
              transform: translateX(0);
            }
          }

          .animate-marquee-slow {
            animation: marquee 60s linear infinite;
            width: fit-content;
            display: flex;
            column-gap: 1rem;
          }

          .animate-marquee-reverse-slow {
            animation: marquee-reverse 60s linear infinite;
            width: fit-content;
            display: flex;
            column-gap: 1rem;
          }

          .marquee-container > * {
            flex: 0 0 350px;
          }
        `}</style>

        {/* Add required styles for animations only */}
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-32 relative overflow-hidden">
        {/* Dynamic background with animated gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-cyan-600"></div>
        {/* Animated circles */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div
            className="absolute w-96 h-96 top-1/4 -left-12 bg-gradient-to-br from-cyan-300/30 to-blue-300/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "8s" }}
          ></div>
          <div
            className="absolute w-80 h-80 top-3/4 right-1/4 bg-gradient-to-br from-emerald-300/20 to-cyan-300/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "10s", animationDelay: "1s" }}
          ></div>
          <div
            className="absolute w-64 h-64 bottom-0 right-0 bg-gradient-to-br from-blue-300/20 to-emerald-300/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "7s", animationDelay: "0.5s" }}
          ></div>
        </div>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="cta-dots"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="10" cy="10" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-dots)" />
          </svg>
        </div>
        {/* Add global styles for animations */}
        <style jsx global>{`
          @keyframes pulse {
            0%,
            100% {
              opacity: 0.5;
            }
            50% {
              opacity: 0.8;
            }
          }

          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-350px * 10));
            }
          }

          @keyframes marquee-reverse {
            0% {
              transform: translateX(calc(-350px * 10));
            }
            100% {
              transform: translateX(0);
            }
          }

          .animate-marquee-slow {
            animation: marquee 120s linear infinite;
            width: calc(350px * 20);
            will-change: transform;
          }

          .animate-marquee-reverse-slow {
            animation: marquee-reverse 120s linear infinite;
            width: calc(350px * 20);
            will-change: transform;
          }

          @media (prefers-reduced-motion) {
            .animate-marquee-slow,
            .animate-marquee-reverse-slow {
              animation-play-state: paused;
            }
          }
        `}</style>{" "}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-6 bg-white/90 text-blue-800 hover:bg-white py-2 px-4">
                <Sparkles className="w-4 h-4 mr-2" />
                Get Started Today
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Work Experience?
              </h2>
              <p className="text-xl text-blue-50 mb-8">
                Join thousands of businesses and freelancers already growing
                with Bizzlink. Whether you're hiring or looking for work, start
                your journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup?type=client">
                  <Button
                    size="lg"
                    className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-6 rounded-full shadow-xl font-semibold w-full sm:w-auto"
                  >
                    <Briefcase className="w-5 h-5 mr-2" />
                    Hire Talent
                  </Button>
                </Link>
                <Link href="/auth/signup?type=freelancer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-6 rounded-full font-semibold bg-transparent w-full sm:w-auto"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Find Work
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-400 rounded-full opacity-20 animate-pulse"></div>
              <div
                className="absolute -bottom-8 -right-8 w-32 h-32 bg-purple-400 rounded-full opacity-20 animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>

              <div className="relative bg-white p-8 rounded-3xl shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Image
                      src="/professional-woman-developer.png"
                      alt="Freelancer"
                      width={60}
                      height={60}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Alex Morgan
                      </h4>
                      <p className="text-sm text-gray-600">
                        Full Stack Developer
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Available
                  </Badge>
                </div>

                <div className="bg-indigo-50 rounded-2xl p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-indigo-900">
                      Project Completed
                    </h4>
                    <Badge className="bg-indigo-100 text-indigo-800">
                      + $3,500
                    </Badge>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Successfully delivered e-commerce platform with custom
                    payment integration ahead of schedule.
                  </p>
                  <div className="flex items-center mt-4">
                    <div className="flex">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-current"
                          />
                        ))}
                    </div>
                    <span className="text-sm font-medium text-gray-900 ml-2">
                      5.0
                    </span>
                    <span className="text-xs text-gray-600 ml-1">
                      (Client Rating)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 text-indigo-600 mr-2" />
                    <span className="text-sm text-gray-700">
                      127 Jobs Completed
                    </span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm text-gray-700">$95k+ Earned</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 pt-20 pb-10">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 px-6 lg:px-8 py-16">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-8">
                <Image
                  src="/images/bizzlink-icon.png"
                  alt="Bizzlink"
                  width={52}
                  height={52}
                  className="w-13 h-13"
                />
                <span className="text-3xl font-bold text-white ml-3">
                  Bizzlink
                </span>
              </div>
              <p className="text-gray-300 mb-10 text-lg max-w-md leading-relaxed">
                The leading platform connecting businesses with skilled
                freelancers to create successful collaborations worldwide.
              </p>

              <h5 className="text-white font-semibold mb-5 text-lg">
                Download Our App
              </h5>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#"
                  className="bg-black border border-gray-700 hover:border-gray-500 rounded-xl py-3 px-5 flex items-center transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-white w-7 h-7 mr-3"
                  >
                    <path d="M17.0383 10.1842C17.0193 8.30439 18.0904 7.0594 18.1379 7.01178C17.4338 6.1151 16.3659 5.99808 15.9876 5.98813C15.0371 5.89082 14.0988 6.52141 13.618 6.52141C13.1371 6.52141 12.3213 6.0007 11.6054 6.01808C10.7117 6.03547 9.91784 6.49774 9.5088 7.2398C8.68422 8.72238 9.28491 10.8927 10.0729 12.0731C10.463 12.662 10.9318 13.3023 11.5324 13.2601C12.1212 13.2178 12.4044 12.9233 13.1084 12.9233C13.8004 12.9233 14.0481 13.2601 14.6844 13.2372C15.3309 13.2178 15.7404 12.6395 16.1185 12.0507C16.5638 11.3936 16.7403 10.7366 16.7522 10.6943C16.7403 10.6846 15.0609 9.98501 15.0371 8.11748C15.0133 6.57559 16.3541 5.73802 16.4015 5.70334C15.7522 4.79434 14.7573 4.70944 14.4146 4.69697C13.4672 4.61915 12.5971 5.17322 12.1212 5.17322C11.6452 5.17322 10.8651 4.71085 10.0611 4.71085C8.31259 4.71085 6.5 6.10825 6.5 8.83256C6.5 10.1842 6.81894 11.604 7.32231 12.6643C7.93139 13.9293 9.33981 15.6172 10.8176 15.5734C11.2867 15.5529 11.9304 15.2046 12.755 15.2046C13.5438 15.2046 14.1671 15.5734 14.6608 15.5734C16.139 15.5734 17.4102 13.9911 18 12.7233C17.0978 12.2884 16.4281 11.1063 16.4064 10.1842H17.0383Z" />
                    <path d="M14.8943 3.65622C15.4237 3.02224 15.7684 2.14392 15.6805 1.25293C14.9178 1.28244 13.9902 1.74807 13.4357 2.36629C12.941 2.91557 12.5249 3.82765 12.6245 4.68696C13.4845 4.75138 14.3407 4.2879 14.8943 3.65622Z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-xs text-gray-400">Download on the</p>
                    <p className="text-white font-medium text-base">
                      App Store
                    </p>
                  </div>
                </Link>
                <Link
                  href="#"
                  className="bg-black border border-gray-700 hover:border-gray-500 rounded-xl py-3 px-5 flex items-center transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-white w-7 h-7 mr-3"
                  >
                    <path d="M4.70873 3.30974C4.37595 3.67372 4.18607 4.23769 4.18607 4.94764C4.18607 5.64163 4.37595 6.21364 4.70873 6.56562C5.05301 6.93763 5.52727 7.1106 6.08539 7.1106C6.63201 7.1106 7.09476 6.93763 7.43905 6.56562C7.78333 6.21364 7.97321 5.64163 7.97321 4.93561C7.97321 4.22566 7.78333 3.66169 7.44056 3.30171C7.09778 2.92969 6.63352 2.76477 6.08539 2.76477C5.52727 2.76477 5.05301 2.92969 4.70873 3.30974ZM7.78333 7.76869H4.38746V15.9204H7.78333V7.76869ZM12.4981 7.76869H9.13731V15.9204H12.4981V11.4957C12.4981 10.1795 13.3262 9.92756 13.7723 9.92756C14.2184 9.92756 15.0616 10.2515 15.0616 11.4957V15.9204H18.4224V11.0033C18.4224 8.08437 16.2212 7.57224 15.0616 7.57224C13.902 7.57224 12.8978 8.39408 12.4981 8.88217V7.76869Z" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M2.5 0C1.53789 0 0.637939 0.36979 0 1.00736V19.9926C0.637939 20.6302 1.53789 21 2.5 21H19.5C20.4621 21 21.3621 20.6302 22 19.9926V1.00736C21.3621 0.36979 20.4621 0 19.5 0H2.5ZM4.25 19.25C4.94036 19.25 5.5 18.6904 5.5 18C5.5 17.3096 4.94036 16.75 4.25 16.75C3.55964 16.75 3 17.3096 3 18C3 18.6904 3.55964 19.25 4.25 19.25Z"
                    />
                  </svg>
                  <div className="text-left">
                    <p className="text-xs text-gray-400">Get it on</p>
                    <p className="text-white font-medium text-base">
                      Google Play
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">
                For Clients
              </h4>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <Link
                    href="/projects/post"
                    className="hover:text-white transition-colors"
                  >
                    Post a Project
                  </Link>
                </li>
                <li>
                  <Link
                    href="/freelancers"
                    className="hover:text-white transition-colors"
                  >
                    Find Freelancers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-it-works"
                    className="hover:text-white transition-colors"
                  >
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing Plans
                  </Link>
                </li>
                <li>
                  <Link
                    href="/enterprise"
                    className="hover:text-white transition-colors"
                  >
                    Enterprise Solutions
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-6">
                For Freelancers
              </h4>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <Link
                    href="/projects"
                    className="hover:text-white transition-colors"
                  >
                    Find Work
                  </Link>
                </li>
                <li>
                  <Link
                    href="/success-tips"
                    className="hover:text-white transition-colors"
                  >
                    Success Tips
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resources"
                    className="hover:text-white transition-colors"
                  >
                    Learning Resources
                  </Link>
                </li>
                <li>
                  <Link
                    href="/community"
                    className="hover:text-white transition-colors"
                  >
                    Community
                  </Link>
                </li>
                <li>
                  <Link
                    href="/freelancer-plus"
                    className="hover:text-white transition-colors"
                  >
                    Freelancer Plus
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-6">
                Support & Legal
              </h4>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <Link
                    href="/help"
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/security"
                    className="hover:text-white transition-colors"
                  >
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Sign-up */}
          <div className="bg-gray-800 rounded-2xl p-8 mt-8 mb-16 mx-6 lg:mx-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-3">
                <h4 className="text-xl lg:text-2xl font-bold text-white mb-2">
                  Stay updated with Bizzlink
                </h4>
                <p className="text-gray-300">
                  Get the latest job opportunities, freelancer tips, and
                  platform updates.
                </p>
              </div>
              <div className="lg:col-span-2">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-grow"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links & Copyright */}
          <div className="border-t border-gray-800 px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-6 md:mb-0">
                <Image
                  src="/images/bizzlink-icon.png"
                  alt="Bizzlink"
                  width={36}
                  height={36}
                  className="w-9 h-9 mr-3"
                />
                <p className="text-gray-300">
                  &copy; 2025 Bizzlink. All rights reserved.
                </p>
              </div>

              <div className="flex space-x-6">
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
