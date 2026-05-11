'use client';

import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';

const blogs = [
  {
    title: "10 Must-Visit Hidden Gems in Chittagong",
    excerpt: "Discover the untouched beauty of the hilly tracks and secret waterfalls that only locals know about...",
    image: "https://images.unsplash.com/photo-1590603740183-980e7f6920eb?w=600&q=80",
    date: "May 10, 2026",
    author: "Sajid Ahmed"
  },
  {
    title: "How to Travel Safely During the Monsoon",
    excerpt: "Traveling during rain can be magical if you're prepared. Here's our ultimate guide to monsoon travel in BD...",
    image: "https://images.unsplash.com/photo-1534274988757-a28bf1f539cf?w=600&q=80",
    date: "May 08, 2026",
    author: "Mina Rahman"
  },
  {
    title: "The Rise of Luxury Bus Travel in Bangladesh",
    excerpt: "Gone are the days of uncomfortable journeys. Explore how premium operators are changing the game...",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80",
    date: "May 05, 2026",
    author: "Karim Ullah"
  }
];

export default function BlogSection() {
  return (
    <section className="py-24 bg-background px-6 lg:px-12 border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-amber-600 text-xs font-black tracking-[0.2em] uppercase mb-4">Travel Guides</p>
            <h2 className="text-4xl lg:text-5xl font-black text-foreground font-heading">Latest from <span className="text-amber-500">Our Blog</span></h2>
          </div>
          <button className="flex items-center gap-2 text-foreground font-black uppercase tracking-widest text-xs hover:text-amber-600 transition-colors group">
            View All Posts
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative h-64 overflow-hidden rounded-3xl mb-6 shadow-lg">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-foreground border border-border">
                  Travel Tips
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-amber-500" /> {blog.date}</span>
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-amber-500" /> {blog.author}</span>
              </div>
              
              <h3 className="text-2xl font-black text-foreground mb-4 group-hover:text-amber-600 transition-colors font-heading leading-tight">
                {blog.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 line-clamp-2 font-medium">
                {blog.excerpt}
              </p>
              
              <div className="w-12 h-12 rounded-2xl border border-border flex items-center justify-center group-hover:bg-slate-900 group-hover:border-slate-900 group-hover:text-white transition-all shadow-sm">
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
