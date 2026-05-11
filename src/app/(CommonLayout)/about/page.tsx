'use client';

import { motion } from "framer-motion";
import { Bus, ShieldCheck, Clock, Users, Globe, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  return (
    <div className="bg-background">
      {/* About Hero */}
      <section className="relative overflow-hidden border-b border-border pt-32 pb-40">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-amber-600 text-[10px] font-black tracking-[0.4em] uppercase mb-8">Our Story</p>
            <h1 className="text-5xl md:text-8xl font-black text-foreground mb-10 tracking-tighter font-heading leading-[1.1]">
              Redefining <br />
              <span className="text-amber-500 italic">Travel in Bangladesh</span>
            </h1>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto font-medium leading-relaxed">
              We are Bangladesh&apos;s leading bus ticket booking platform, dedicated to making inter-city travel 
              seamless, secure, and comfortable for everyone through cutting-edge technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-xl"
            >
              <div className="w-20 h-20 bg-amber-500/10 rounded-[28px] flex items-center justify-center mb-10 shadow-sm border border-amber-500/10">
                <Globe className="w-10 h-10 text-amber-600" />
              </div>
              <h2 className="text-4xl lg:text-6xl font-black text-foreground mb-10 font-heading tracking-tight leading-tight">Our <span className="text-amber-500">Vision</span></h2>
              <p className="text-muted-foreground text-xl leading-relaxed font-medium">
                To revolutionize the transportation industry in Bangladesh by leveraging technology 
                to provide the most efficient and user-friendly travel experience. We aim to connect 
                every corner of the country through a single, unified digital platform.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-card p-12 lg:p-16 rounded-[64px] border border-border shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
              <div className="w-24 h-24 bg-emerald-500/10 rounded-[32px] flex items-center justify-center mb-12 shadow-sm relative z-10 group-hover:scale-110 transition-transform duration-500 border border-emerald-500/10">
                <ShieldCheck className="w-12 h-12 text-emerald-600" />
              </div>
              <h2 className="text-4xl lg:text-6xl font-black text-foreground mb-10 font-heading tracking-tight relative z-10 leading-tight">Our <span className="text-emerald-500">Mission</span></h2>
              <p className="text-muted-foreground text-xl leading-relaxed font-medium relative z-10">
                Our mission is to provide travelers with real-time access to bus schedules, 
                seat availability, and secure booking options, while supporting bus operators 
                with robust management tools.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <p className="text-amber-600 text-[10px] font-black tracking-[0.3em] uppercase mb-6">Core Values</p>
            <h2 className="text-4xl lg:text-7xl font-black text-foreground mb-8 font-heading tracking-tighter">Why Thousands Trust Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-medium text-xl leading-relaxed italic">We prioritize your comfort and safety above everything else.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: <Bus className="w-10 h-10" />, title: 'Premium Fleet', desc: 'We only partner with the most reliable and highest-rated bus operators in the country.', color: 'bg-blue-500/10 text-blue-600 border-blue-500/10' },
              { icon: <Clock className="w-10 h-10" />, title: '24/7 Support', desc: 'Our dedicated customer service team is always ready to help you with any issues.', color: 'bg-amber-500/10 text-amber-600 border-amber-500/10' },
              { icon: <Award className="w-10 h-10" />, title: 'Best Price', desc: 'We guarantee the best prices with no hidden charges and regular exclusive discounts.', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10' },
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-12 rounded-[40px] shadow-sm border border-border hover:shadow-2xl hover:border-amber-500/30 transition-all duration-500 text-center group"
              >
                <div className={`w-20 h-20 ${feature.color} border rounded-[28px] flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                  {feature.icon}
                </div>
                <h3 className="text-3xl font-black text-foreground mb-6 font-heading tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground text-base leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 text-center">
            {[
              { label: 'Happy Travelers', value: '500K+' },
              { label: 'Active Routes', value: '1,200+' },
              { label: 'Partner Operators', value: '150+' },
              { label: 'Global Rating', value: '4.9/5' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-5xl lg:text-7xl font-black text-amber-500 mb-6 font-heading tracking-tighter italic">{stat.value}</p>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.4em]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
