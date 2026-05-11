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
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-background py-32 px-6 border-b border-border">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-24"
        >
          <p className="text-amber-600 text-sm font-medium uppercase tracking-wide mb-6">
            Testimonials
          </p>
          <h2 className="text-4xl lg:text-6xl font-bold text-foreground tracking-tight">
            Loved by <br />
            <span className="text-amber-600">50,000+ Happy Travelers</span>
          </h2>
          <p className="text-muted-foreground mt-6 max-w-2xl mx-auto font-normal text-lg leading-relaxed">See why our community ranks us as Bangladesh&apos;s most trusted booking platform.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -12, transition: { duration: 0.3 } }}
              className="group bg-card border border-border rounded-[40px] p-10 relative shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
              <Quote className="absolute top-10 right-10 h-10 w-10 text-muted/10 group-hover:text-amber-500/20 transition-colors" />

              <div className="flex gap-1.5 mb-8">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className={`h-4 w-4 ${s < t.rating ? 'text-amber-500 fill-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]' : 'text-muted-foreground/20'}`} />
                ))}
              </div>

              <p className="text-foreground text-lg leading-relaxed mb-10 font-normal relative z-10">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-5 pt-10 border-t border-border/50 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg shadow-slate-900/10">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-foreground font-semibold text-lg leading-tight mb-1">{t.name}</p>
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                     <p className="text-muted-foreground text-sm font-medium">{t.route}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}