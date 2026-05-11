/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllUsers } from '@/src/services/dashboard-services/operators';
import { Mail, Phone, ArrowRight, ShieldCheck, Users, Activity, Zap, Database, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function AllPassengers() {
  const res = await getAllUsers('PASSENGER');
  const passengers = (res.data ?? []).filter((u: any) => u.role === 'PASSENGER');

  return (
    <section className="min-h-screen bg-background relative overflow-hidden p-6 lg:p-12">
      {/* Dynamic Background */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-amber-500/[0.03] rounded-full blur-[140px] -z-10" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-slate-500/[0.03] rounded-full blur-[140px] -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <p className="text-amber-600 text-[10px] font-black tracking-[0.5em] uppercase mb-5 italic">— REGISTRY CONTROL</p>
            <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter font-heading uppercase italic">
              PASSENGER <span className="text-amber-500">DATABASE</span>
            </h1>
          </div>
          <div className="flex items-center gap-6 bg-card border border-border px-10 py-5 rounded-[32px] shadow-2xl shadow-slate-900/[0.03] backdrop-blur-xl">
             <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-amber-500" />
             </div>
             <div>
                <span className="text-foreground text-[16px] font-black uppercase tracking-widest italic block leading-none mb-1">{passengers.length} NODES</span>
                <span className="text-muted-foreground text-[8px] font-black uppercase tracking-[0.3em] opacity-40 italic">ACTIVE REGISTRY SYNC</span>
             </div>
          </div>
        </div>

        {passengers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 bg-card border border-border border-dashed rounded-[48px] grayscale opacity-40">
             <Database className="w-24 h-24 text-muted-foreground/20 mb-8" />
             <p className="text-foreground font-black text-2xl font-heading uppercase italic tracking-tighter mb-4">NO USER DATA DETECTED</p>
             <p className="text-muted-foreground text-[11px] font-black uppercase tracking-[0.3em] italic">AWAITING PLATFORM SYNCHRONIZATION</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {passengers.map((p: any) => (
              <div key={p.id} className="group bg-card border border-border rounded-[48px] p-10 hover:border-amber-500/30 transition-all duration-700 hover:shadow-2xl hover:shadow-slate-900/[0.05] relative overflow-hidden flex flex-col">
                <div className="flex items-center gap-6 mb-10 relative z-10">
                  <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 font-black text-3xl font-heading group-hover:scale-110 transition-transform duration-700 shadow-2xl italic group-hover:rotate-3">
                    {p.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-foreground font-black text-2xl font-heading uppercase italic tracking-tighter leading-none mb-3 group-hover:text-amber-500 transition-colors duration-500">{p.name}</h3>
                    <span className={`text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border transition-all duration-500 ${p.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover:bg-emerald-500 group-hover:text-white' : 'bg-destructive/10 text-destructive border-destructive/20 group-hover:bg-destructive group-hover:text-white'}`}>
                      {p.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-6 mb-10 p-8 bg-muted/30 border border-border/50 rounded-[32px] group-hover:bg-muted/50 transition-colors duration-700 relative overflow-hidden">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-muted rounded-xl">
                       <Mail className="w-4 h-4 text-amber-600 opacity-60" />
                    </div>
                    <span className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] truncate italic">{p.email}</span>
                  </div>
                  {p.phone && (
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-muted rounded-xl">
                         <Phone className="w-4 h-4 text-amber-600 opacity-60" />
                      </div>
                      <span className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] italic">NODE: {p.phone}</span>
                    </div>
                  )}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/5 to-transparent rounded-full -mr-12 -mt-12" />
                </div>

                <div className="pt-10 border-t border-border/50 flex items-center justify-between mt-auto">
                  <div className="flex flex-col gap-2">
                     <p className="text-muted-foreground text-[9px] font-black uppercase tracking-[0.3em] opacity-40 italic leading-none">SIGNAL START</p>
                     <span className="text-foreground font-black text-xs uppercase tracking-tighter italic leading-none">{new Date(p.createdAt).toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                       {p.isVerified ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                             <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          </div>
                       ) : (
                          <Activity className="w-5 h-5 text-muted-foreground/30 animate-pulse" />
                       )}
                       <span className={`text-[9px] font-black uppercase tracking-[0.2em] italic ${p.isVerified ? 'text-emerald-600' : 'text-muted-foreground/30'}`}>
                          {p.isVerified ? 'VERIFIED' : 'PENDING'}
                       </span>
                    </div>
                    <Link href={`/admin-dashboard/passengers/${p.id}`}>
                      <Button variant="ghost" size="sm" className="h-12 w-12 p-0 rounded-2xl bg-muted border border-border hover:bg-slate-900 hover:text-amber-500 transition-all duration-500 group/btn shadow-xl hover:-translate-y-1">
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
                
                {/* Hover Accent Decor */}
                <div className="absolute top-0 left-0 w-1 h-0 bg-amber-500 group-hover:h-full transition-all duration-700" />
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-20 pt-10 border-t border-border/30">
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.5em] opacity-40 italic">MANAGING <span className="text-foreground font-black">{passengers.length}</span> REGISTERED NODES — DATABASE SECURE</p>
        </div>
      </div>
    </section>
  );
}