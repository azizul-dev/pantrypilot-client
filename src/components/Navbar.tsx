"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChefHat, LogOut, PlusCircle, LayoutDashboard, LogIn, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const mainLinks = [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/recipes" },
    { label: "AI Suggest", href: "/suggest" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/50 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-poppins font-bold text-xl text-primary">
            <ChefHat className="h-6 w-6 text-primary" />
            <span>Pantry<span className="text-secondary">Pilot</span></span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 font-medium">
            {mainLinks.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm py-1 border-b-2 transition-all duration-200 ${
                    active
                      ? "text-primary border-primary font-bold"
                      : "text-text-brown/85 border-transparent hover:text-primary hover:border-primary/30"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/items/add"
                  className="flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-primary transition-colors duration-200"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Recipe</span>
                </Link>
                <Link
                  href="/items/manage"
                  className="flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-primary transition-colors duration-200"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Manage</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 rounded-full border border-neutral-200 px-4 py-1.5 text-sm font-medium text-text-brown hover:bg-neutral-50 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/95 transition-all duration-200 hover:-translate-y-0.5"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center rounded-md p-2 text-text-brown hover:bg-neutral-100 hover:text-primary transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 top-16 z-40 bg-black md:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              className="fixed right-0 top-16 bottom-0 z-50 w-72 bg-white p-6 shadow-xl md:hidden flex flex-col justify-between"
            >
              <div className="flex flex-col gap-6">
                <nav className="flex flex-col gap-4">
                  {mainLinks.map((link) => {
                    const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={toggleMenu}
                        className={`font-poppins font-medium text-lg transition-colors border-l-4 pl-3 py-1 ${
                          active
                            ? "text-primary border-primary"
                            : "text-text-brown border-transparent hover:text-primary hover:border-primary/30"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
                <hr className="border-neutral-100" />
                <div className="flex flex-col gap-4">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/items/add"
                        onClick={toggleMenu}
                        className="flex items-center gap-2.5 font-medium text-text-brown hover:text-primary"
                      >
                        <PlusCircle className="h-5 w-5 text-secondary" />
                        <span>Add Recipe</span>
                      </Link>
                      <Link
                        href="/items/manage"
                        onClick={toggleMenu}
                        className="flex items-center gap-2.5 font-medium text-text-brown hover:text-primary"
                      >
                        <LayoutDashboard className="h-5 w-5 text-secondary" />
                        <span>Manage</span>
                      </Link>
                    </>
                  ) : null}
                </div>
              </div>

              <div>
                {isAuthenticated ? (
                  <button
                    onClick={() => { logout(); toggleMenu(); }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 py-3 font-medium text-text-brown hover:bg-neutral-50"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={toggleMenu}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-medium text-white shadow-sm hover:bg-primary/95"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
