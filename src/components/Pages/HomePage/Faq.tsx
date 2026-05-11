'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I book a ticket?",
    answer: "Simply search for your destination, select a bus and seat, and proceed to secure payment. Your ticket will be sent via email and SMS instantly."
  },
  {
    question: "What is the refund policy?",
    answer: "You can cancel your ticket up to 12 hours before departure for a 90% refund. Cancellations within 12 hours are subject to a 50% fee."
  },
  {
    question: "Are the buses safe and sanitized?",
    answer: "Yes, all our partner operators follow strict health guidelines. Buses are sanitized after every trip, and drivers undergo regular health checks."
  },
  {
    question: "Can I choose my specific seat?",
    answer: "Absolutely! Our real-time seat mapping allows you to pick your preferred seat (window, aisle, or front) during the booking process."
  },
  {
    question: "What if my bus is delayed?",
    answer: "We provide real-time tracking and SMS alerts. If a significant delay occurs, you will be notified, and options for rescheduling or refund will be provided."
  }
];

export default function FaqSection() {
  return (
    <section className="py-24 bg-background px-6 lg:px-12 border-b border-border">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-amber-600 text-xs font-black tracking-[0.2em] uppercase mb-4">Got Questions?</p>
          <h2 className="text-4xl lg:text-5xl font-black text-foreground font-heading">Frequently Asked <span className="text-amber-500">Questions</span></h2>
          <p className="text-muted-foreground mt-4 font-medium text-lg">Everything you need to know about our bus booking service.</p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <AccordionItem value={`item-${i}`} className="bg-card border border-border rounded-2xl px-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="text-lg font-black text-foreground hover:text-amber-600 hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6 font-medium">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
