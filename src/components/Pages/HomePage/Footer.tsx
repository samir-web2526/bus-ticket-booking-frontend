'use client';

import { Bus, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getAllRoutes } from '@/src/services/routes.service';
import { useEffect, useState } from 'react';

interface Route {
  id: string;
  sourceCity: string;
  destinationCity: string;
}

const footerLinks = {
  Company: ['About', 'Find Buses', 'Routes'],
  Support: ['Help Center', 'Contact Us', 'Refund Policy', 'Terms of Service'],
};

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
        } else {
          setRouteLinks(FALLBACK_ROUTES);
        }
      } catch (err) {
        console.error('Failed to fetch routes for footer:', err);
        setRouteLinks(FALLBACK_ROUTES);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-gray-900 font-bold text-lg">Get travel deals in your inbox</h3>
            <p className="text-gray-500 text-sm mt-1">Subscribe for exclusive offers and route updates.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Input
              placeholder="your@email.com"
              className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-amber-400 w-full sm:w-64"
            />
            <Button className="bg-amber-500 hover:bg-amber-400 text-white font-bold shrink-0 shadow-md shadow-amber-100">
              Subscribe
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center">
              <Bus className="h-5 w-5 text-white" />
            </div>
            <span className="text-gray-900 font-black text-xl" style={{ fontFamily: "'Sora', sans-serif" }}>
              BusTicketBD
            </span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
            Bangladesh&apos;s most trusted bus booking platform. Fast, secure, and always reliable — for every journey.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            {[
              { icon: <MapPin className="h-4 w-4 text-amber-500" />, text: 'House 12, Road 5, Banani, Dhaka 1213' },
              { icon: <Phone className="h-4 w-4 text-amber-500" />, text: '+880 1700-000000' },
              { icon: <Mail className="h-4 w-4 text-amber-500" />, text: 'support@busticketbd.com' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-start gap-2.5 text-gray-500 text-sm">
                <span className="mt-0.5 shrink-0">{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>

        {Object.entries(footerLinks).map(([group, links]) => (
          <div key={group}>
            <h4 className="text-gray-900 font-bold text-sm mb-5 tracking-wide">{group}</h4>
            <ul className="flex flex-col gap-3">
              {links.map((link) => {
                const linkMap: Record<string, string> = {
                  'About': '/about',
                  'Find Buses': '/find-buses',
                  'Routes': '/routes',
                  'Help Center': '#',
                  'Contact Us': '#',
                  'Refund Policy': '#',
                  'Terms of Service': '#',
                };
                return (
                  <li key={link}>
                    <a href={linkMap[link] || '#'} className="text-gray-500 text-sm hover:text-amber-600 transition-colors">
                      {link}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="text-gray-900 font-bold text-sm mb-5 tracking-wide">Routes</h4>
          <ul className="flex flex-col gap-3">
            {isLoading ? (
              <li className="text-gray-400 text-sm italic">Loading routes...</li>
            ) : routeLinks.length > 0 ? (
              routeLinks.map((route) => (
                <li key={route.id}>
                  <a href={`/routes/${route.id}`} className="text-gray-500 text-sm hover:text-amber-600 transition-colors">
                    {route.sourceCity} → {route.destinationCity}
                  </a>
                </li>
              ))
            ) : (
              <li className="text-gray-400 text-sm italic">No routes available</li>
            )}
          </ul>
        </div>
      </div>

      <Separator className="bg-gray-200" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} BusTicketBD. All rights reserved.
        </p>
        <div className="flex gap-5">
          {['Privacy Policy', 'Terms of Use', 'Cookie Policy'].map((l) => (
            <a key={l} href="#" className="text-gray-400 text-sm hover:text-amber-600 transition-colors">
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}