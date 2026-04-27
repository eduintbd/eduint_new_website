"use client";

import Accordion from "@/components/ui/Accordion";

const FAQ_ITEMS = [
  {
    title: "How does the AI matching work?",
    content: "Our AI analyzes your academic profile, including GPA, test scores, field of study, career goals, budget, and preferred countries. It then compares your profile against 1,400+ programs from 600+ partner universities across 26 study destinations to rank programs by compatibility and acceptance probability.",
  },
  {
    title: "Is the platform free to use?",
    content: "Yes! Creating an account, browsing programs, using the AI chat, and getting AI match recommendations are completely free. Premium services like document review, SOP editing, and dedicated counseling are available at additional cost.",
  },
  {
    title: "Which countries can I study in?",
    content: "We currently support programs across 26 study destinations including Australia, Canada, United States, United Kingdom, Germany, Ireland, New Zealand, France, Netherlands, and many more across Europe and Asia.",
  },
  {
    title: "How is EDUINTBD different from other consultancies?",
    content: "We combine traditional consultancy expertise with cutting-edge AI technology. While other consultancies rely on manual matching, our AI processes thousands of programs in seconds, ensuring you never miss a perfect opportunity. Plus, our 360-degree support covers everything from program discovery to visa approval.",
  },
  {
    title: "What documents do I need to apply?",
    content: "Typical requirements include: academic transcripts, valid passport, language test scores (IELTS/TOEFL), Statement of Purpose (SOP), letters of recommendation, and financial documents. Requirements vary by program — our AI assistant can tell you exactly what you need.",
  },
  {
    title: "Can I get scholarship recommendations?",
    content: "Absolutely! Our AI identifies programs with scholarship opportunities that match your profile. We also provide guidance on external scholarship applications and financial planning to make your study abroad dream affordable.",
  },
];

export default function FAQ() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Everything you need to know about studying abroad with EDUINTBD.
          </p>
        </div>

        <Accordion items={FAQ_ITEMS} />
      </div>
    </section>
  );
}
