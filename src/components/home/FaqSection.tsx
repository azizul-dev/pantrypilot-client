"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "How does the AI recipe generator work?",
    answer: "Our advanced algorithm takes the list of ingredients you currently have in your pantry and matches them with our recipe library, or generates entirely unique recipes based on classic flavor pairings and culinary rules.",
  },
  {
    question: "Can I customize recipes based on my diet?",
    answer: "Absolutely! You can filter recipes and AI generation by Vegan, Vegetarian, Gluten-Free, Low-Carb, and many other dietary preferences or allergies.",
  },
  {
    question: "Is PantryPilot free to use?",
    answer: "Yes, our core platform, recipe browser, and daily AI recipe generation are completely free. We also offer a premium tier for advanced meal planning calendars.",
  },
  {
    question: "Can I save my own custom recipes?",
    answer: "Yes, once you sign up for a free account, you can add, edit, and organize your own custom recipes in your personal digital recipe book.",
  },
];

export default function FaqSection() {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  return (
    <section id="contact" className="py-20 bg-bg-cream">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-poppins font-extrabold text-3xl text-secondary text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="flex flex-col gap-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-neutral-200/50 shadow-sm overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-poppins font-bold text-sm sm:text-base text-secondary">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-neutral-400 transition-transform duration-250 ${
                    openFaqIdx === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openFaqIdx === idx && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 pt-1 text-sm text-text-brown/75 leading-relaxed border-t border-neutral-50/50">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}