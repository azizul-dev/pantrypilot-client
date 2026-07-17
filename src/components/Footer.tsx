"use client";

import Link from "next/link";
import { ChefHat, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Explore Recipes", href: "/recipes" },
    { label: "Our Blog", href: "/blog" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const categories = [
    { label: "Quick & Easy", href: "#explore" },
    { label: "Healthy Eats", href: "#explore" },
    { label: "Vegetarian", href: "#explore" },
    { label: "Baking & Desserts", href: "#explore" },
    { label: "Meal Prep", href: "#explore" },
  ];

  const socials = [
    {
      label: "Facebook",
      href: "https://facebook.com",
      svg: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
        </svg>
      )
    },
    {
      label: "Twitter",
      href: "https://twitter.com",
      svg: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      label: "Instagram",
      href: "https://instagram.com",
      svg: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    },
    {
      label: "YouTube",
      href: "https://youtube.com",
      svg: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.388.553a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.553 9.388.553 9.388.553s7.518 0 9.388-.553a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-secondary text-neutral-200 mt-auto border-t border-secondary/20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: About */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 font-poppins font-bold text-xl text-white">
              <ChefHat className="h-6 w-6 text-primary" />
              <span>Pantry<span className="text-primary">Pilot</span></span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed">
              PantryPilot is an AI-powered meal companion designed to help you generate culinary masterpieces directly from the ingredients in your pantry. Reduce waste and eat healthy.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-2">
              {socials.map((social, idx) => {
                return (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-primary hover:text-white transition-all duration-200 hover:-translate-y-1"
                  >
                    {social.svg}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-poppins font-semibold text-white text-base mb-4 tracking-wide">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h3 className="font-poppins font-semibold text-white text-base mb-4 tracking-wide">Categories</h3>
            <ul className="space-y-2.5 text-sm">
              {categories.map((cat) => (
                <li key={cat.label}>
                  <Link
                    href={cat.href}
                    className="text-neutral-400 hover:text-primary transition-colors duration-200"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-poppins font-semibold text-white text-base mb-4 tracking-wide">Contact Us</h3>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>123 Culinary Drive, Foodie City, FC 90210</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>hello@pantrypilot.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>&copy; {new Date().getFullYear()} PantryPilot. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#privacy" className="hover:text-neutral-300">Privacy Policy</Link>
            <Link href="#terms" className="hover:text-neutral-300">Terms of Service</Link>
            <Link href="#cookies" className="hover:text-neutral-300">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
