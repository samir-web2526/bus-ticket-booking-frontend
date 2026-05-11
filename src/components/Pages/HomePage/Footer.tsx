"use client";

import { Bus } from 'lucide-react';
import { 
  RiFacebookFill, 
  RiTwitterXFill, 
  RiInstagramFill, 
  RiLinkedinFill, 
  RiGithubFill 
} from "@remixicon/react";
import { Button } from '@/components/ui/button';
import { getAllRoutes } from '@/src/services/routes.service';
import { useEffect, useState } from 'react';

interface Route {
  id: string;
  sourceCity: string;
  destinationCity: string;
}

const footerLinks = {
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '#' },
    { label: 'Blog', href: '/blog' },
    { label: 'Press', href: '#' },
  ],
  Services: [
    { label: 'Find Buses', href: '/find-buses' },
    { label: 'All Routes', href: '/routes' },
    { label: 'Schedules', href: '/schedules' },
    { label: 'Special VIP', href: '#' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Refund Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

const socialLinks = [
  { icon: <RiFacebookFill className="w-5 h-5" />, href: '#', color: 'hover:text-blue-600' },
  { icon: <RiTwitterXFill className="w-5 h-5" />, href: '#', color: 'hover:text-sky-500' },
  { icon: <RiInstagramFill className="w-5 h-5" />, href: '#', color: 'hover:text-pink-600' },
  { icon: <RiLinkedinFill className="w-5 h-5" />, href: '#', color: 'hover:text-blue-700' },
  { icon: <RiGithubFill className="w-5 h-5" />, href: '#', color: 'hover:text-slate-900' },
];

const FALLBACK_ROUTES: Route[] = [
  { id: '1', sourceCity: 'Dhaka', destinationCity: 'Chittagong' },
  { id: '2', sourceCity: 'Dhaka', destinationCity: 'Sylhet' },
  { id: '3', sourceCity: 'Dhaka', destinationCity: "Cox's Bazar" },
  { id: '4', sourceCity: 'Dhaka', destinationCity: 'Rajshahi' },
];

export default function Footer() {
  const [routeLinks, setRouteLinks] = useState<Route[]>(FALLBACK_ROUTES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setIsLoading(true);
        const result = await getAllRoutes({ limit: 4 });
        if (result.data && result.data.length > 0) {
          setRouteLinks(result.data);
        }
      } catch (err) {
        console.error('Failed to fetch routes for footer:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  return (
    <footer className="bg-background pt-32 pb-16 border-t border-border relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-24">
          <div className="lg:col-span-4 flex flex-col items-start">
            <div className="flex items-center gap-4 mb-10 group cursor-pointer">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl shadow-slate-900/20 group-hover:scale-110 transition-transform duration-500">
                <Bus className="h-6 w-6 text-white" />
              </div>
              <span className="text-foreground font-black text-3xl font-heading tracking-tighter leading-none">
                Bus<span className="text-amber-500 italic">Hub</span>
              </span>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-sm font-medium italic">
              Redefining intercity travel in Bangladesh. Experience the pinnacle of safety, comfort, and reliability with every booking.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  className={`w-12 h-12 rounded-2xl bg-muted/30 flex items-center justify-center text-muted-foreground transition-all duration-500 ${social.color} hover:bg-card hover:shadow-2xl hover:-translate-y-1 border border-border group`}
                >
                  <div className="group-hover:scale-110 transition-transform">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-12">
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group}>
                <h4 className="text-foreground font-black text-[10px] mb-10 tracking-[0.4em] uppercase font-heading">{group}</h4>
                <ul className="flex flex-col gap-6">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-muted-foreground text-sm font-black uppercase tracking-widest hover:text-amber-600 transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h4 className="text-foreground font-black text-[10px] mb-10 tracking-[0.4em] uppercase font-heading">Network</h4>
              <ul className="flex flex-col gap-6">
                {isLoading ? (
                  <li className="text-muted-foreground text-[10px] font-black uppercase tracking-widest italic animate-pulse">Synchronizing...</li>
                ) : (
                  routeLinks.map((route) => (
                    <li key={route.id}>
                      <a href={`/routes/${route.id}`} className="text-muted-foreground text-sm font-black uppercase tracking-widest hover:text-amber-600 transition-colors truncate block">
                        {route.sourceCity.slice(0, 3)} <span className="text-amber-500">→</span> {route.destinationCity.slice(0, 3)}
                      </a>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-12 flex flex-col lg:row items-center justify-between gap-10">
          <div className="flex flex-col md:flex-row items-center gap-10 text-muted-foreground text-[10px] font-black uppercase tracking-[0.4em]">
            <span className="opacity-60">© {new Date().getFullYear()} BUSHUB ELITE NETWORK</span>
            <div className="flex gap-10">
              <a href="#" className="hover:text-amber-500 transition-all duration-300">Privacy</a>
              <a href="#" className="hover:text-amber-500 transition-all duration-300">Terms</a>
              <a href="#" className="hover:text-amber-500 transition-all duration-300">Security</a>
            </div>
          </div>
          
          <div className="flex items-center gap-5 text-foreground font-black text-[10px] uppercase tracking-[0.3em] bg-muted/20 px-8 py-4 rounded-full border border-border shadow-inner">
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
             Global Systems Operational
          </div>
        </div>
      </div>
    </footer>
  );
}