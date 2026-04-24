
import { Bus, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getAllRoutes } from '@/src/services/routes.service';


const footerLinks = {
  Company: ['About Us', 'Careers', 'Press', 'Blog'],
  Support: ['Help Center', 'Contact Us', 'Refund Policy', 'Terms of Service'],
};

export default async function Footer() {
  let routeLinks: string[] = [];

  try {
    const result = await getAllRoutes({ limit: 4 });
    
    if (result.data && result.data.length > 0) {
      routeLinks = result.data.map(
        (route) => `${route.sourceCity} → ${route.destinationCity}`
      );
    }
  } catch (err) {
    console.error('Failed to fetch routes for footer:', err);
    // Fallback routes
    routeLinks = [
      'Dhaka → Chittagong',
      'Dhaka → Sylhet',
      "Dhaka → Cox's Bazar",
      'Dhaka → Rajshahi',
    ];
  }

  return (
    <footer className="bg-[#030810] border-t border-white/10">
      {/* Newsletter bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white font-bold text-lg">Get travel deals in your inbox</h3>
            <p className="text-slate-400 text-sm mt-1">Subscribe for exclusive offers and route updates.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Input
              placeholder="your@email.com"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-amber-400 w-full sm:w-64"
            />
            <Button className="bg-amber-400 hover:bg-amber-300 text-black font-bold shrink-0">
              Subscribe
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center">
              <Bus className="h-5 w-5 text-black" />
            </div>
            <span
              className="text-white font-black text-xl"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              BusTicketBD
            </span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Bangladesh&apos;s most trusted bus booking platform. Fast, secure, and always reliable — for every journey.
          </p>

          {/* Contact info */}
          <div className="mt-6 flex flex-col gap-3">
            {[
              { icon: <MapPin className="h-4 w-4 text-amber-400" />, text: 'House 12, Road 5, Banani, Dhaka 1213' },
              { icon: <Phone className="h-4 w-4 text-amber-400" />, text: '+880 1700-000000' },
              { icon: <Mail className="h-4 w-4 text-amber-400" />, text: 'support@busticketbd.com' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-start gap-2.5 text-slate-400 text-sm">
                <span className="mt-0.5 shrink-0">{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        {Object.entries(footerLinks).map(([group, links]) => (
          <div key={group}>
            <h4 className="text-white font-bold text-sm mb-5 tracking-wide">{group}</h4>
            <ul className="flex flex-col gap-3">
              {links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-slate-400 text-sm hover:text-amber-400 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Dynamic Routes */}
        <div>
          <h4 className="text-white font-bold text-sm mb-5 tracking-wide">Routes</h4>
          <ul className="flex flex-col gap-3">
            {routeLinks.map((route) => (
              <li key={route}>
                <a
                  href="#"
                  className="text-slate-400 text-sm hover:text-amber-400 transition-colors"
                >
                  {route}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} BusTicketBD. All rights reserved.
        </p>
        <div className="flex gap-5">
          {['Privacy Policy', 'Terms of Use', 'Cookie Policy'].map((l) => (
            <a key={l} href="#" className="text-slate-500 text-sm hover:text-amber-400 transition-colors">
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}