'use client';

import { motion } from "framer-motion";
import { MapPin, Headset, MessageSquare, Globe } from "lucide-react";
import ContactSection from "@/src/components/Pages/HomePage/Contact";

export default function ContactPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border pt-32 pb-40">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-amber-600 text-[10px] font-black tracking-[0.4em] uppercase mb-8">Support Center</p>
            <h1 className="text-5xl md:text-8xl font-black text-foreground mb-10 tracking-tighter font-heading leading-tight">
              Connect with <span className="text-amber-500 italic">BusHub</span>
            </h1>
            <p className="text-muted-foreground max-w-3xl mx-auto font-medium text-xl leading-relaxed">
              Experience seamless communication with Bangladesh&apos;s most responsive travel platform. 
              Our team is ready to assist you 24/7 with any inquiries or booking support.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Contact Form & Info */}
      <div className="relative z-20 -mt-10">
        <ContactSection />
      </div>
      
      {/* Interactive Map Placeholder */}
      <section className="py-32 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
             <p className="text-amber-600 text-[10px] font-black tracking-[0.3em] uppercase mb-6">Our Location</p>
             <h2 className="text-4xl lg:text-6xl font-black text-foreground font-heading tracking-tight">Visit Our Office</h2>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card h-[600px] rounded-[64px] flex flex-col items-center justify-center border border-border shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-slate-500/5 opacity-50" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
            
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 bg-amber-500/10 rounded-[32px] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 border border-amber-500/10 shadow-xl shadow-amber-500/5">
                <MapPin className="w-12 h-12 text-amber-600" />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-3 font-heading italic">Dhaka HQ</h3>
              <p className="text-muted-foreground font-black uppercase tracking-[0.3em] text-[10px] mb-8">123 Transport Plaza, North Tower, Dhaka</p>
              
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-muted rounded-full border border-border text-[10px] font-black text-muted-foreground uppercase tracking-widest animate-pulse">
                <Globe className="w-4 h-4" /> Interactive Map Module Loading
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Help Grid */}
      <section className="py-32 border-t border-border">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-10">
               {[
                 { icon: <Headset className="w-8 h-8" />, title: "Live Chat", desc: "Average response time: 2 mins", label: "Start Chat" },
                 { icon: <MessageSquare className="w-8 h-8" />, title: "WhatsApp", desc: "Available 24/7 for quick pings", label: "Send Message" },
                 { icon: <Mail className="w-8 h-8" />, title: "Email Support", desc: "Formal inquiries & corporate help", label: "Email Us" }
               ].map((item, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.1 }}
                   className="p-10 bg-card rounded-[40px] border border-border hover:shadow-2xl hover:border-amber-500/30 transition-all duration-500 group text-center"
                 >
                    <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:bg-amber-500 group-hover:text-white transition-colors duration-500">
                       {item.icon}
                    </div>
                    <h4 className="text-xl font-black text-foreground mb-2 font-heading">{item.title}</h4>
                    <p className="text-muted-foreground text-sm font-medium mb-8 italic">{item.desc}</p>
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest border-b-2 border-amber-500/30 pb-1 cursor-pointer hover:border-amber-500 transition-colors">{item.label}</span>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
}

import { Mail } from "lucide-react";
