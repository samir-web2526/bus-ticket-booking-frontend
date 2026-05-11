'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-background px-6 lg:px-12 border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-amber-600 text-xs font-black tracking-[0.2em] uppercase mb-4">Get in Touch</p>
            <h2 className="text-4xl lg:text-5xl font-black text-foreground font-heading mb-6">
              Have Questions? <br />
              <span className="text-amber-500">We&apos;re Here to Help</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed font-medium">
              Our dedicated support team is available 24/7 to assist you with bookings, 
              cancellations, or any other inquiries you may have.
            </p>

            <div className="space-y-6">
              {[
                { icon: <Phone className="w-5 h-5" />, label: 'Call Us', value: '+880 1234 567890', color: 'bg-blue-500/10 text-blue-600' },
                { icon: <Mail className="w-5 h-5" />, label: 'Email Us', value: 'support@bushub.com', color: 'bg-amber-500/10 text-amber-600' },
                { icon: <MapPin className="w-5 h-5" />, label: 'Visit Us', value: '123 Transport Plaza, Dhaka, Bangladesh', color: 'bg-emerald-500/10 text-emerald-600' },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 group"
                >
                  <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">{item.label}</p>
                    <p className="text-foreground font-black text-lg">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-card p-8 md:p-12 rounded-[48px] shadow-2xl shadow-slate-200/50 border border-border relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex items-center gap-3 mb-10 relative z-10">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-foreground font-heading">Send a Message</h3>
            </div>

            <form className="space-y-6 relative z-10">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-foreground/70 uppercase tracking-widest ml-1">Full Name</label>
                  <Input placeholder="John Doe" className="h-14 px-6 rounded-2xl bg-muted/30 border-border focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:bg-background transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-foreground/70 uppercase tracking-widest ml-1">Email Address</label>
                  <Input placeholder="john@example.com" className="h-14 px-6 rounded-2xl bg-muted/30 border-border focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:bg-background transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-foreground/70 uppercase tracking-widest ml-1">Subject</label>
                <Input placeholder="Booking Inquiry" className="h-14 px-6 rounded-2xl bg-muted/30 border-border focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:bg-background transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-foreground/70 uppercase tracking-widest ml-1">Message</label>
                <textarea 
                  placeholder="How can we help you?" 
                  className="w-full h-32 p-6 rounded-2xl bg-muted/30 border border-border focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-background text-sm transition-all resize-none"
                />
              </div>
              <Button className="w-full h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-black text-lg flex items-center justify-center gap-2 group border-none shadow-lg shadow-amber-500/20 active:scale-95 transition-all">
                Send Message
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
