import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">CommunityKitchen</h3>
            <p className="text-sm text-gray-500">
              Supporting community kitchens that make a difference in local communities.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-gray-700">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-700">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-700">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/campaigns" className="text-gray-500 hover:text-gray-700">
                  Explore Campaigns
                </Link>
              </li>
              <li>
                <Link href="/campaigns/create" className="text-gray-500 hover:text-gray-700">
                  Start a Campaign
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-500 hover:text-gray-700">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-500 hover:text-gray-700">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="/about/team" className="text-gray-500 hover:text-gray-700">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/about/impact" className="text-gray-500 hover:text-gray-700">
                  Impact Stories
                </Link>
              </li>
              <li>
                <Link href="/about/contact" className="text-gray-500 hover:text-gray-700">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-gray-500 hover:text-gray-700">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-500 hover:text-gray-700">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-500 hover:text-gray-700">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} CommunityKitchen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
