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
    color: 'from-amber-500/10 to-orange-500/10',
  },
  {
    id: 2,
    name: 'Nusrat Jahan',
    city: 'Chittagong',
    avatar: 'NJ',
    rating: 5,
    text: 'Finally a bus booking app that actually works! No fake seats, no confusion. The real-time availability is a game changer.',
    route: "Chittagong → Cox's Bazar",
    color: 'from-blue-500/10 to-cyan-500/10',
  },
  {
    id: 3,
    name: 'Tanvir Ahmed',
    city: 'Sylhet',
    avatar: 'TA',
    rating: 4,
    text: 'Great experience overall. Customer support helped me reschedule my trip quickly. The refund process was hassle-free too.',
    route: 'Dhaka → Sylhet',
    color: 'from-emerald-500/10 to-teal-500/10',
  },
  {
    id: 4,
    name: 'Sumaiya Khanam',
    city: 'Rajshahi',
    avatar: 'SK',
    rating: 5,
    text: 'Traveled with my family to Rajshahi and everything went perfectly. The bus was on time and the seats were exactly as described.',
    route: 'Dhaka → Rajshahi',
    color: 'from-purple-500/10 to-violet-500/10',
  },
  {
    id: 5,
    name: 'Mahmud Hassan',
    city: 'Khulna',
    avatar: 'MH',
    rating: 5,
    text: "I've tried multiple booking sites but this one is by far the fastest and most reliable. Highly recommended for frequent travelers.",
    route: 'Dhaka → Khulna',
    color: 'from-rose-500/10 to-pink-500/10',
  },
  {
    id: 6,
    name: 'Farida Begum',
    city: 'Barisal',
    avatar: 'FB',
    rating: 4,
    text: 'Easy to use even for someone not very tech-savvy. My daughter helped me book and the whole process took just a few minutes.',
    route: 'Dhaka → Barisal',
    color: 'from-teal-500/10 to-cyan-500/10',
  },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="bg-[#07111f] py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">
            — Testimonials
          </p>
          <h2
            className="text-4xl lg:text-5xl font-black text-white"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Loved by <span className="text-amber-400">50,000+</span> Riders
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`bg-gradient-to-br ${t.color} border border-white/10 rounded-2xl p-6 relative`}
            >
              <Quote className="absolute top-5 right-5 h-8 w-8 text-white/5" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${s < t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Footer */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold text-sm flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.route}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}