import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react"
import Link from "next/link"

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-linear-to-tr from-[#FFD700] via-[#FFA500] to-[#FF8C00] bg-[length:200%_200%] bg-clip-text text-transparent">
              G-LIMIT STUDIO
            </h3>
            <p className="text-sm opacity-80">Capturing life&apos;s precious moments with artistic excellence and professional dedication.</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold bg-linear-to-tr from-[#FFD700] via-[#FFA500] to-[#FF8C00] bg-[length:200%_200%] bg-clip-text text-transparent">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:text-gold transition-smooth">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-sm hover:text-gold transition-smooth">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm hover:text-gold transition-smooth">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:text-gold transition-smooth">
                  About
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-sm hover:text-gold transition-smooth">
                  News
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold bg-linear-to-tr from-[#FFD700] via-[#FFA500] to-[#FF8C00] bg-[length:200%_200%] bg-clip-text text-transparent">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <Phone className="h-4 w-4 text-amber-300 mt-0.5" />
                <a href="tel:+6327001-6157" className="text-sm hover:text-gold transition-smooth">
                  (02) 7001-6157
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Mail className="h-4 w-4 text-amber-300 mt-0.5" />
                <a href="mailto:infinitechcorp.ph@gmail.com" className="text-sm hover:text-gold transition-smooth ">
                  infinitechcorp.ph@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm">
  <MapPin className="h-4 w-4 text-amber-300 mt-0.5" />
  <a
    href="https://www.google.com/maps/search/?api=1&query=Unit+303+Campos+Rueda+Building+Urban+Ave+Makati+City+1230+Metro+Manila"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-amber-300 transition-colors cursor-pointer underline decoration-amber-300/50 hover:decoration-amber-300"
  >
    Unit 303, Campos Rueda Building, Urban Ave, Makati City
    <br />
    1230 Metro Manila
  </a>
</li>
            </ul>
            <div className="pt-2 space-y-1">
              <h4 className="text-sm font-semibold bg-linear-to-tr from-[#FFD700] via-[#FFA500] to-[#FF8C00] bg-[length:200%_200%] bg-clip-text text-transparent">
                Operating Hours
              </h4>
              <p className="text-sm">Mon - Fri: 9AM - 6PM</p>
              <p className="text-sm">Sat - Sun: By Appointment</p>
            </div>
          </div>

          {/* Social & Policies */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold bg-linear-to-tr from-[#FFD700] via-[#FFA500] to-[#FF8C00] bg-[length:200%_200%] bg-clip-text text-transparent">
              Follow Us
            </h4>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-smooth">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/people/Infinitech-Advertising-Corp/100080647808810/" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-smooth">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-smooth">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            <div className="pt-4 space-y-2">
              {/* <h4 className="text-sm font-semibold bg-linear-to-tr from-[#FFD700] via-[#FFA500] to-[#FF8C00] bg-[length:200%_200%] bg-clip-text text-transparent">
                Policies
              </h4> */}
              {/* <ul className="space-y-1">
                <li>
                  <Link href="/privacy" className="text-sm hover:text-gold transition-smooth">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm hover:text-gold transition-smooth">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-sm hover:text-gold transition-smooth">
                    FAQs
                  </Link>
                </li>
              </ul> */}
            </div>
          </div>
        </div>

        <div className="border-t border-gold/20 mt-12 pt-4 text-center">
          <p className="text-sm opacity-80">© {new Date().getFullYear()} G-Limit Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer