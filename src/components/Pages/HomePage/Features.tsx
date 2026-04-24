'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, Clock, CreditCard, Headphones, MapPin, Smartphone } from 'lucide-react';

const features = [
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: 'Secure Payments',
    desc: 'All transactions are encrypted and processed through Stripe — your money is always safe.',
    color: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/30',
    iconColor: 'text-emerald-400',
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Real-Time Seats',
    desc: 'Live seat availability updated every second — no double bookings, ever.',
    color: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30',
    iconColor: 'text-blue-400',
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: 'Easy Refunds',
    desc: 'Cancel before departure and get your refund within 3–5 business days. No questions asked.',
    color: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/30',
    iconColor: 'text-amber-400',
  },
  {
    icon: <Headphones className="h-6 w-6" />,
    title: '24/7 Support',
    desc: 'Our support team is always online — call, chat, or email any time of day.',
    color: 'from-purple-500/20 to-violet-500/20',
    border: 'border-purple-500/30',
    iconColor: 'text-purple-400',
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: '500+ Routes',
    desc: 'From major cities to remote towns — we cover every corner of Bangladesh.',
    color: 'from-rose-500/20 to-pink-500/20',
    border: 'border-rose-500/30',
    iconColor: 'text-rose-400',
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: 'Mobile Friendly',
    desc: 'Book on the go — our platform works flawlessly on any device, any screen size.',
    color: 'from-teal-500/20 to-cyan-500/20',
    border: 'border-teal-500/30',
    iconColor: 'text-teal-400',
  },
];

export default function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="bg-[#050d1a] py-24 px-6 lg:px-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">
            — Why Us
          </p>
          <h2
            className="text-4xl lg:text-5xl font-black text-white"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Built for the <span className="text-amber-400">Modern Traveler</span>
          </h2>
          <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">
            Everything you need for a seamless journey — from booking to boarding.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`group bg-gradient-to-br ${f.color} border ${f.border} rounded-2xl p-6 cursor-default`}
            >
              <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 ${f.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                {f.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}