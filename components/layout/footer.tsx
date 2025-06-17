import Link from "next/link"
import { Shield, Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">SecureHome</span>
            </div>
            <p className="text-slate-300">Professional security solutions to protect what matters most to you.</p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Products</h3>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link href="/products?category=cameras" className="hover:text-white">
                  Security Cameras
                </Link>
              </li>
              <li>
                <Link href="/products?category=locks" className="hover:text-white">
                  Smart Locks
                </Link>
              </li>
              <li>
                <Link href="/products?category=alarms" className="hover:text-white">
                  Alarm Systems
                </Link>
              </li>
              <li>
                <Link href="/products?category=sensors" className="hover:text-white">
                  Motion Sensors
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link href="/support" className="hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/installation" className="hover:text-white">
                  Installation Guide
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="hover:text-white">
                  Warranty
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-slate-300 text-sm">Get the latest security tips and product updates.</p>
            <div className="flex space-x-2">
              <Input placeholder="Enter your email" className="bg-slate-800 border-slate-700 text-white" />
              <Button className="bg-blue-600 hover:bg-blue-700">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; 2024 SecureHome. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
