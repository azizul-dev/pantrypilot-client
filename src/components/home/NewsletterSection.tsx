"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle } from "lucide-react";

export default function NewsletterSection() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus("loading");
    setTimeout(() => {
      setNewsletterStatus("success");
      setNewsletterEmail("");
    }, 1200);
  };

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-secondary/5 border border-secondary/10 p-8 sm:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 h-44 w-44 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 text-center flex flex-col gap-4 max-w-xl mx-auto">
            <span className="p-2.5 bg-primary/10 rounded-2xl text-primary w-fit mx-auto">
              <Mail className="h-5 w-5" />
            </span>
            <h2 className="font-poppins font-extrabold text-2xl sm:text-3xl text-secondary">
              Get Weekly AI Meal Plans
            </h2>
            <p className="text-text-brown/70 text-sm leading-relaxed">
              Join our newsletter list to receive seasonal recipe ideas, grocery optimization tips, and platform updates.
            </p>

            {newsletterStatus === "success" ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-secondary/10 text-secondary border border-secondary/20 p-4 rounded-xl font-medium text-sm mt-4 flex items-center justify-center gap-2"
              >
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Success! You've joined the PantryPilot kitchen squad.</span>
              </motion.div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 mt-4 w-full">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-grow rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === "loading"}
                  className="bg-primary hover:bg-primary/95 text-white font-semibold px-6 py-3 rounded-xl text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  {newsletterStatus === "loading" ? "Subscribing..." : "Subscribe Now"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}