"use client";

import { useState, useEffect } from "react";

interface FeaturedReview {
  _id: string;
  rating: number;
  comment: string;
  userId: { name: string; avatar?: string };
  recipeId: { title: string };
}

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState<FeaturedReview[]>([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
        const res = await fetch(`${apiUrl}/reviews/featured`);
        const json = await res.json();
        if (res.ok && json?.data?.reviews) {
          setReviews(json.data.reviews);
        }
      } catch (err) {
        console.error("Failed to fetch featured reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    if (reviews.length === 0) return;
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  // Don't render the section at all if there's nothing real to show
  if (!loading && reviews.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl text-secondary text-center mb-14">
            Loved by Cooks Everywhere
          </h2>
          <div className="bg-bg-cream rounded-2xl p-8 sm:p-12 shadow-sm border border-neutral-100 animate-pulse h-64" />
        </div>
      </section>
    );
  }

  const current = reviews[activeTestimonial];

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
              {current.comment}
            </p>
            <div className="flex items-center gap-3.5 mt-4">
              <img
                src={
                  current.userId.avatar ||
                  `https://api.dicebear.com/8.x/avataaars/svg?seed=${encodeURIComponent(current.userId.name)}`
                }
                alt={current.userId.name}
                className="w-12 h-12 rounded-full object-cover border border-neutral-200"
              />
              <div className="text-left">
                <h4 className="font-poppins font-bold text-sm text-secondary">
                  {current.userId.name}
                </h4>
                <span className="text-xs text-text-brown/60">
                  Reviewed {current.recipeId.title}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-6">
              {reviews.map((_, i) => (
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
