'use client';

import { motion } from 'framer-motion';
import { Sparkles, Wind, ShieldCheck, Coffee, Wifi, Tv } from 'lucide-react';

const services = [
  {
    title: 'Elite Sleeper',
    desc: 'Fully reclining beds, personal entertainment, and premium snacks for long-haul comfort.',
    icon: <Sparkles className="w-8 h-8 text-amber-500" />,
    features: ['Flatbed Seats', 'Meals Included', 'Personal TV'],
    color: 'group-hover:border-amber-500/30'
  },
  {
    title: 'Executive AC',
    desc: 'Ergonomic seating with high-speed WiFi and climate control for a professional journey.',
    icon: <Wind className="w-8 h-8 text-emerald-500" />,
    features: ['Turbo AC', 'Free WiFi', 'Power Outlets'],
    color: 'group-hover:border-emerald-500/30'
  },
  {
    title: 'Global Economy',
    desc: 'Reliable and punctual service at unbeatable prices for everyday inter-city travel.',
    icon: <ShieldCheck className="w-8 h-8 text-blue-500" />,
    features: ['Regular Stops', 'Leg Space', 'Safe Driving'],
    color: 'group-hover:border-blue-500/30'
  }
];

export default function ServicesSection() {
  return (
    <section className="py-24 bg-background px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-amber-600 text-sm font-medium uppercase tracking-wide mb-6">Service Excellence</p>
          <h2 className="text-4xl lg:text-6xl font-bold text-foreground tracking-tight">Choose Your <span className="text-amber-600">Comfort Class</span></h2>
          <p className="text-muted-foreground mt-6 max-w-2xl mx-auto font-normal text-lg leading-relaxed">Experience the ultimate in road travel with our curated fleet options.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -12 }}
              className={`group p-10 rounded-[40px] bg-card border border-border transition-all duration-500 shadow-sm hover:shadow-2xl ${service.color}`}
            >
              <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 border border-border">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 tracking-tight">{service.title}</h3>
              <p className="text-muted-foreground text-base leading-relaxed mb-8 font-normal">{service.desc}</p>
              
              <ul className="space-y-4 pt-10 border-t border-border">
                {service.features.map(f => (
                  <li key={f} className="flex items-center gap-4 text-foreground text-sm font-medium">
                    <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
