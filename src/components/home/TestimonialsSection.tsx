"use client";

import { useState, useEffect } from "react";

const TESTIMONIALS = [
  {
    quote: "PantryPilot completely changed how I cook. I just type in whatever is getting old in my fridge and suddenly I have a gourmet dinner plan!",
    author: "Sarah Jenkins",
    role: "Busy Mother of Two",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
  },
  {
    quote: "As a college student on a budget, this tool is a lifesaver. I waste zero food and eat better than I ever did before.",
    author: "Marcus Chen",
    role: "Computer Science Student",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
  },
  {
    quote: "The recipe recommendations are spot on. I love the ease of tracking what I have and the gorgeous cooking guides.",
    author: "Elena Rostova",
    role: "Culinary Enthusiast",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
  },
];

export default function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl text-secondary text-center mb-14">
          Loved by Cooks Everywhere
        </h2>

        <div className="relative bg-bg-cream rounded-2xl p-8 sm:p-12 shadow-sm border border-neutral-100">
          <div className="flex flex-col items-center text-center gap-6">
            <span className="text-5xl text-primary font-serif">“</span>
            <p className="font-poppins font-medium text-base sm:text-lg text-text-brown/95 max-w-2xl italic leading-relaxed">
              {TESTIMONIALS[activeTestimonial].quote}
            </p>
            <div className="flex items-center gap-3.5 mt-4">
              <img
                src={TESTIMONIALS[activeTestimonial].image}
                alt={TESTIMONIALS[activeTestimonial].author}
                className="w-12 h-12 rounded-full object-cover border border-neutral-200"
              />
              <div className="text-left">
                <h4 className="font-poppins font-bold text-sm text-secondary">
                  {TESTIMONIALS[activeTestimonial].author}
                </h4>
                <span className="text-xs text-text-brown/60">
                  {TESTIMONIALS[activeTestimonial].role}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-6">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === activeTestimonial ? "w-6 bg-primary" : "w-2 bg-neutral-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}