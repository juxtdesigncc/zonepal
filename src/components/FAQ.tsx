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
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="">
      {faqData.map((item, index) => (
        <details
          key={index}
          itemScope
          itemProp="mainEntity"
          itemType="https://schema.org/Question"
          className="border-b py-8"
        >
          <summary
            itemProp="name"
            className="flex justify-between items-center text-lg font-semibold cursor-pointer py-4"
            onClick={() => toggleFAQ(index)}
          >
            {item.question}
            <span className="transition-transform duration-200 group-open:rotate-180">
              <ChevronDown
                className={`w-4 h-4`}
              />
            </span>
          </summary>
          <div
            itemScope
            itemProp="acceptedAnswer"
            itemType="https://schema.org/Answer"
            className="py-2"
          >
            <p itemProp="text" className="text-lg text-secondary leading-relaxed whitespace-pre-line py-6">
              {item.answer}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}