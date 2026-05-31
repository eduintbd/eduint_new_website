"use client";

import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Fatima Rahman",
    university: "University of Toronto",
    country: "Canada",
    image: null,
    text: "EDUINTBD's AI matched me with programs I never would have found on my own. Within minutes, I had a shortlist of 5 perfect programs. I got accepted to my top choice with a scholarship!",
    rating: 5,
  },
  {
    name: "Arif Hossain",
    university: "University of Melbourne",
    country: "Australia",
    image: null,
    text: "The 360 support was incredible — from IELTS prep guidance to visa application. The AI counselor answered all my questions at midnight when I was stressed about deadlines.",
    rating: 5,
  },
  {
    name: "Nusrat Jahan",
    university: "Technical University of Munich",
    country: "Germany",
    image: null,
    text: "I was amazed to discover tuition-free programs in Germany through their platform. The GPA converter tool and personalized matching saved me weeks of research.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-[#111111]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="eyebrow text-sm text-gray-500 dark:text-gray-400 mb-3">Success Stories</p>
          <h2 className="display-title text-3xl sm:text-4xl text-gray-900 dark:text-white mb-4">
            Student Success Stories
          </h2>
          <p className="max-w-2xl text-gray-600 dark:text-gray-400">
            Hear from students who found their dream programs through our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.name}
              className="p-6 rounded-none bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800"
            >
              <Quote className="h-8 w-8 text-[#E0FE9C] mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#E0FE9C] text-[#E0FE9C]" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-none bg-[#E0FE9C] flex items-center justify-center text-black font-bold text-sm">
                  {testimonial.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {testimonial.university}, {testimonial.country}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
