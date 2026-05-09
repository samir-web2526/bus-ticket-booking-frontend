'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Rafiqul Islam',
    city: 'Dhaka',
    avatar: 'RI',
    rating: 5,
    text: 'Booked a Dhaka–Chittagong trip in under 2 minutes. Seat selection was smooth and payment through Stripe felt super secure. Will use again!',
    route: 'Dhaka → Chittagong',
    color: 'from-amber-50 to-orange-50',
    border: 'border-amber-200',
  },
  {
    id: 2,
    name: 'Nusrat Jahan',
    city: 'Chittagong',
    avatar: 'NJ',
    rating: 5,
    text: 'Finally a bus booking app that actually works! No fake seats, no confusion. The real-time availability is a game changer.',
    route: "Chittagong → Cox's Bazar",
    color: 'from-blue-50 to-cyan-50',
    border: 'border-blue-200',
  },
  {
    id: 3,
    name: 'Tanvir Ahmed',
    city: 'Sylhet',
    avatar: 'TA',
    rating: 4,
    text: 'Great experience overall. Customer support helped me reschedule my trip quickly. The refund process was hassle-free too.',
    route: 'Dhaka → Sylhet',
    color: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-200',
  },
  {
    id: 4,
    name: 'Sumaiya Khanam',
    city: 'Rajshahi',
    avatar: 'SK',
    rating: 5,
    text: 'Traveled with my family to Rajshahi and everything went perfectly. The bus was on time and the seats were exactly as described.',
    route: 'Dhaka → Rajshahi',
    color: 'from-purple-50 to-violet-50',
    border: 'border-purple-200',
  },
  {
    id: 5,
    name: 'Mahmud Hassan',
    city: 'Khulna',
    avatar: 'MH',
    rating: 5,
    text: "I've tried multiple booking sites but this one is by far the fastest and most reliable. Highly recommended for frequent travelers.",
    route: 'Dhaka → Khulna',
    color: 'from-rose-50 to-pink-50',
    border: 'border-rose-200',
  },
  {
    id: 6,
    name: 'Farida Begum',
    city: 'Barisal',
    avatar: 'FB',
    rating: 4,
    text: 'Easy to use even for someone not very tech-savvy. My daughter helped me book and the whole process took just a few minutes.',
    route: 'Dhaka → Barisal',
    color: 'from-teal-50 to-cyan-50',
    border: 'border-teal-200',
  },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="bg-white py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-amber-600 text-sm font-semibold tracking-widest uppercase mb-3">
            — Testimonials
          </p>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900" style={{ fontFamily: "'Sora', sans-serif" }}>
            Loved by <span className="text-amber-500">50,000+</span> Riders
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`bg-gradient-to-br ${t.color} border ${t.border} rounded-2xl p-6 relative shadow-sm hover:shadow-md transition-shadow duration-300`}
            >
              <Quote className="absolute top-5 right-5 h-8 w-8 text-gray-200" />

              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className={`h-4 w-4 ${s < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                ))}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600 font-bold text-sm flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-gray-900 font-semibold text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.route}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}