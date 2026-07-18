"use client";

import { motion } from "framer-motion";

export default function HowItWorksSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto mb-16 flex flex-col gap-3"
        >
          <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl text-secondary">
            Three Simple Steps to Mealtime Bliss
          </h2>
          <p className="text-text-brown/70 text-sm sm:text-base leading-relaxed">
            No complex meal prep required. Our flow connects you directly from food scraps to delicious gourmet recipes in seconds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { n: 1, title: "Add Ingredients", text: "Input the ingredients you want to use. Add everything from fresh veggies to pantry spices." },
            { n: 2, title: "Get AI Suggestions", text: "Our Gemini-powered AI engine instantly compiles customized suggestions with precise matching ratios." },
            { n: 3, title: "Cook & Enjoy", text: "Follow the clear, step-by-step guides with cook times, and prepare healthy meals." },
          ].map((step, idx) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="flex flex-col items-center p-6"
            >
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold font-poppins mb-6">
                {step.n}
              </div>
              <h3 className="font-poppins font-bold text-lg text-secondary mb-2">{step.title}</h3>
              <p className="text-text-brown/70 text-sm text-center leading-relaxed">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}