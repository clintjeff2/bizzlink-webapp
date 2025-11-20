"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image
                src="/images/bizzlink-icon.png"
                alt="Bizzlink"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                Bizzlink
              </span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Connecting talented freelancers with ambitious clients worldwide.
              Build your dreams with the best professionals.
            </p>
          </div>

          {/* For Clients */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold mb-4 text-white">
              For Clients
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/how-it-works"
                  className="text-gray-300 hover:text-[#00d455] transition-colors text-sm"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/freelancers"
                  className="text-gray-300 hover:text-[#00d455] transition-colors text-sm"
                >
                  Find Freelancers
                </Link>
              </li>
              <li>
                <Link
                  href="/projects/post"
                  className="text-gray-300 hover:text-[#00d455] transition-colors text-sm"
                >
                  Post a Project
                </Link>
              </li>
              <li>
                <Link
                  href="/client/dashboard"
                  className="text-gray-300 hover:text-[#00d455] transition-colors text-sm"
                >
                  Client Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* For Freelancers */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold mb-4 text-white">
              For Freelancers
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/projects"
                  className="text-gray-300 hover:text-[#00d455] transition-colors text-sm"
                >
                  Find Work
                </Link>
              </li>
              <li>
                <Link
                  href="/freelancer/dashboard"
                  className="text-gray-300 hover:text-[#00d455] transition-colors text-sm"
                >
                  Freelancer Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/success-tips"
                  className="text-gray-300 hover:text-[#00d455] transition-colors text-sm"
                >
                  Success Tips
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-gray-300 hover:text-[#00d455] transition-colors text-sm"
                >
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold mb-4 text-white">
              Support & Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-gray-300 hover:text-[#00d455] transition-colors text-sm"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-[#00d455] transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-300 hover:text-[#00d455] transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-300 hover:text-[#00d455] transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-[#00d455] transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Information & Social Media - Full Width Section */}
        <div className="border-t border-gray-700 pt-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">
                Get In Touch
              </h4>
              <div className="space-y-3">
                <a
                  href="mailto:support@bizzlink.com"
                  className="flex items-center gap-3 text-gray-300 hover:text-[#0055ff] transition-colors text-sm group"
                >
                  <div className="p-2.5 bg-gray-800 rounded-lg group-hover:bg-[#0055ff] transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email us</p>
                    <p className="font-medium">support@bizzlink.com</p>
                  </div>
                </a>

                <a
                  href="tel:+1234567890"
                  className="flex items-center gap-3 text-gray-300 hover:text-[#0055ff] transition-colors text-sm group"
                >
                  <div className="p-2.5 bg-gray-800 rounded-lg group-hover:bg-[#0055ff] transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Call us</p>
                    <p className="font-medium">+1 (234) 567-890</p>
                  </div>
                </a>

                <Link
                  href="/help"
                  className="flex items-center gap-3 text-gray-300 hover:text-[#00d455] transition-colors text-sm group"
                >
                  <div className="p-2.5 bg-gray-800 rounded-lg group-hover:bg-[#00d455] transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Need help?</p>
                    <p className="font-medium">Visit FAQs & Support Center</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">
                Follow Us
              </h4>
              <p className="text-sm text-gray-400 mb-4">
                Stay connected on social media for updates, tips, and success
                stories
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.facebook.com/bizzlink"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#1877F2] rounded-lg hover:bg-[#1877F2]/90 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a
                  href="https://www.instagram.com/bizzlink"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-pink-500/50"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a
                  href="https://www.linkedin.com/company/bizzlink"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#0A66C2] rounded-lg hover:bg-[#0A66C2]/90 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-blue-400/50"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
                <a
                  href="https://www.tiktok.com/@bizzlink"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-black rounded-lg hover:bg-black/90 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-gray-500/50"
                  aria-label="TikTok"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@bizzlink"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#FF0000] rounded-lg hover:bg-[#FF0000]/90 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-red-500/50"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} Bizzlink. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="/terms"
                className="text-gray-400 hover:text-[#00d455] transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-[#00d455] transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/cookies"
                className="text-gray-400 hover:text-[#00d455] transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
