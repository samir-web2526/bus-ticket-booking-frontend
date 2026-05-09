'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, Clock, CreditCard, Headphones, MapPin, Smartphone } from 'lucide-react';

const features = [
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: 'Secure Payments',
    desc: 'All transactions are encrypted and processed through Stripe — your money is always safe.',
    color: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Real-Time Seats',
    desc: 'Live seat availability updated every second — no double bookings, ever.',
    color: 'from-blue-50 to-cyan-50',
    border: 'border-blue-200',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: 'Easy Refunds',
    desc: 'Cancel before departure and get your refund within 3–5 business days. No questions asked.',
    color: 'from-orange-50 to-amber-50',
    border: 'border-orange-200',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    icon: <Headphones className="h-6 w-6" />,
    title: '24/7 Support',
    desc: 'Our support team is always online — call, chat, or email any time of day.',
    color: 'from-purple-50 to-violet-50',
    border: 'border-purple-200',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: '500+ Routes',
    desc: 'From major cities to remote towns — we cover every corner of Bangladesh.',
    color: 'from-rose-50 to-pink-50',
    border: 'border-rose-200',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: 'Mobile Friendly',
    desc: 'Book on the go — our platform works flawlessly on any device, any screen size.',
    color: 'from-teal-50 to-cyan-50',
    border: 'border-teal-200',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
  },
];

export default function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="bg-white py-24 px-6 lg:px-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gray-100 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-amber-600 text-sm font-semibold tracking-widest uppercase mb-3">
            — Why Us
          </p>
          <h2
            className="text-4xl lg:text-5xl font-black text-gray-900"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Built for the <span className="text-amber-500">Modern Traveler</span>
          </h2>
          <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
            Everything you need for a seamless journey — from booking to boarding.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`group bg-gradient-to-br ${f.color} border ${f.border} rounded-2xl p-6 cursor-default shadow-sm hover:shadow-md transition-shadow duration-300`}
            >
              <div className={`w-12 h-12 rounded-xl ${f.iconBg} border ${f.border} flex items-center justify-center mb-5 ${f.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                {f.icon}
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}