"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, Map } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-4">
        <h1 className="font-poppins font-extrabold text-4xl sm:text-5xl text-secondary">
          Get in Touch
        </h1>
        <p className="text-text-brown/70 text-lg">
          Have a question about our recipes, or want to partner with PantryPilot? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Contact Info & Map */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          className="flex flex-col gap-10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.div variants={fadeUp} className="flex flex-col gap-3 p-6 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-2">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="font-poppins font-bold text-secondary">Email Us</h3>
              <a href="mailto:hello@pantrypilot.com" className="text-text-brown/70 hover:text-primary transition-colors text-sm">
                hello@pantrypilot.com
              </a>
            </motion.div>
            
            <motion.div variants={fadeUp} className="flex flex-col gap-3 p-6 rounded-2xl bg-secondary/5 border border-secondary/10">
              <div className="h-10 w-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mb-2">
                <Phone className="h-5 w-5" />
              </div>
              <h3 className="font-poppins font-bold text-secondary">Call Us</h3>
              <a href="tel:+15551234567" className="text-text-brown/70 hover:text-secondary transition-colors text-sm">
                +1 (555) 123-4567
              </a>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-secondary font-bold font-poppins">
              <MapPin className="h-5 w-5 text-primary" />
              Headquarters
            </div>
            <p className="text-text-brown/70 text-sm">
              We're a remote-first team — reach us anytime via email or the form below.
            </p>
          </motion.div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-neutral-100"
        >
          <h2 className="font-poppins font-bold text-2xl text-secondary mb-6">Send a Message</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="firstName" className="text-sm font-semibold text-text-brown/80">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  required
                  className="rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow bg-neutral-50/50 focus:bg-white"
                  placeholder="Jane"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="lastName" className="text-sm font-semibold text-text-brown/80">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  required
                  className="rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow bg-neutral-50/50 focus:bg-white"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-text-brown/80">Email Address</label>
              <input
                type="email"
                id="email"
                required
                className="rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow bg-neutral-50/50 focus:bg-white"
                placeholder="jane@example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="subject" className="text-sm font-semibold text-text-brown/80">Subject</label>
              <select
                id="subject"
                className="rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow bg-neutral-50/50 focus:bg-white appearance-none"
              >
                <option>General Inquiry</option>
                <option>Recipe Support</option>
                <option>Feedback & Suggestions</option>
                <option>Partnerships</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm font-semibold text-text-brown/80">Message</label>
              <textarea
                id="message"
                required
                rows={5}
                className="rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow bg-neutral-50/50 focus:bg-white resize-y"
                placeholder="How can we help you?"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || submitted}
              className={`mt-2 w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all ${
                submitted 
                  ? "bg-green-500" 
                  : "bg-primary hover:bg-primary/95 hover:-translate-y-0.5 shadow-md active:translate-y-0"
              }`}
            >
              {isSubmitting ? (
                <span className="animate-pulse">Sending...</span>
              ) : submitted ? (
                "Message Sent!"
              ) : (
                <>
                  Send Message
                  <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
