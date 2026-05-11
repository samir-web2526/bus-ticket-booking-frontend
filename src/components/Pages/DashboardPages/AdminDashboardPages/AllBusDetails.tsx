import { getBusById } from "@/src/services/buses.service";
import { ArrowLeft, AlertCircle, ShieldAlert, Activity } from "lucide-react";
import Link from "next/link";
import BusDetailsClient from "./BusDetailsClient";

export default async function BusDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getBusById(id);

  if ("error" in result) {
    return (
      <section className="bg-background min-h-screen py-24 px-6 lg:px-12 relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-destructive/[0.03] rounded-full blur-[140px] -z-10" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <Link
            href="/admin-dashboard/buses"
            className="inline-flex items-center gap-4 text-muted-foreground hover:text-foreground text-[10px] font-black uppercase tracking-widest mb-12 transition-all group italic"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform text-amber-500" /> BACK TO REGISTRY
          </Link>
          
          <div className="flex items-center justify-center h-[500px] bg-card border border-border rounded-[56px] shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            
            <div className="text-center relative z-10 px-12">
              <div className="w-20 h-20 rounded-[32px] bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mx-auto mb-8 animate-pulse">
                <ShieldAlert className="h-10 w-10" />
              </div>
              <h3 className="text-4xl font-black text-foreground mb-4 font-heading italic tracking-tighter uppercase leading-none">Diagnostic Error</h3>
              <p className="text-muted-foreground font-medium italic mb-2">FAILED TO ESTABLISH ASSET LINK</p>
              <p className="text-destructive text-[10px] font-black uppercase tracking-widest mt-6 bg-destructive/10 px-6 py-2 rounded-full inline-block italic border border-destructive/20">
                {result.error}
              </p>
            </div>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-4 text-muted-foreground/20 text-[9px] font-black uppercase tracking-[0.5em] italic">
             <Activity className="w-4 h-4" /> SECURE HANDSHAKE FAILED
          </div>
        </div>
      </section>
    );
  }

  return <BusDetailsClient id={id} />;
}