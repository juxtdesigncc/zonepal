"use client"

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is a percentage?",
    answer: "A percentage is a way of expressing a number as a fraction of 100.",
  },
  {
    question: "How do I calculate a ratio?",
    answer: "A ratio is calculated by dividing one number by another.",
  },
  {
    question: "What is the difference between percentage and conversion?",
    answer: "Percentage measures how much one value is relative to another, while conversion measures the effectiveness of a process.",
  },
  {
    question: "What is the advantage of using a percentage calculator?",
    answer: "A percentage calculator simplifies complex calculations, saves time, and reduces the risk of errors, making it easier to analyze data quickly."
  },
  {
    question: "What are the ideal use cases for a percentage calculator?",
    answer: "Percentage calculators are ideal for various scenarios, including calculating conversion rates, analyzing drop-off rates in sales funnels, and determining profit margins and ratios."
  },
  {
    question: "Who should use a percentage calculator?",
    answer: "Percentage calculators are useful for business analysts, product managers, product designers, marketers, and anyone needing to interpret data or make informed decisions based on percentages."
  },
  {
    question: "What are the best practices for using a percentage calculator?",
    answer: "Best practices include double-checking input values for accuracy, understanding the context of the percentage being calculated, and using the results to guide decision-making rather than relying solely on the numbers."
  },
  {
    question: "How can a percentage calculator help in financial analysis?",
    answer: "In financial analysis, a percentage calculator can help determine profit margins, growth rates, and return on investment (ROI), providing crucial insights for business strategy."
  },
  {
    question: "Can a percentage calculator be used for educational purposes?",
    answer: "Yes, percentage calculators are beneficial in educational settings for teaching students about percentages, ratios, and their applications in real-world scenarios."
  },
  {
    question: "Are there any limitations to using a percentage calculator?",
    answer: "While percentage calculators are helpful, they may not account for all variables in complex scenarios, so it's essential to complement their results with deeper analysis when needed."
  },
];


export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mt-4">
      {faqData.map((item, index) => (
        <div key={index} className="border-b">
          <button
            className="w-full text-left py-4 cursor-pointer font-bold flex items-center justify-between h-12 min-w-[200px]"
            onClick={() => toggleFAQ(index)}
          >
            {item.question}
            <ChevronDown
              className={`ml-2 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''} h-6 w-6`}
            />
          </button>
          {openIndex === index && (
            <div className="p-4">{item.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
} 