"use client";

import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  { name: "Fatima Rahman", university: "University of Toronto", country: "Canada", text: "EDUINT's AI matched me with programs I never would have found on my own. Within minutes, I had a shortlist of 5 perfect programs. I got accepted to my top choice with a scholarship!", rating: 5 },
  { name: "Arif Hossain", university: "University of Melbourne", country: "Australia", text: "The 360 support was incredible — from IELTS prep guidance to visa application. The AI counselor answered all my questions at midnight when I was stressed about deadlines.", rating: 5 },
  { name: "Nusrat Jahan", university: "Technical University of Munich", country: "Germany", text: "I was amazed to discover tuition-free programs in Germany through their platform. The GPA converter tool and personalized matching saved me weeks of research.", rating: 5 },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="eyebrow text-lime mb-4">Student success stories</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Students who found their fit
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((testimonial) => (
            <div key={testimonial.name} className="p-7 border border-white/15 flex flex-col h-full">
              <Quote className="h-8 w-8 text-lime mb-5" />
              <p className="text-white/80 mb-6 text-[15px] leading-relaxed flex-1">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-lime text-lime" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-lime flex items-center justify-center text-ink font-bold text-sm">
                  {testimonial.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                  <p className="text-xs text-white/50">{testimonial.university}, {testimonial.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
