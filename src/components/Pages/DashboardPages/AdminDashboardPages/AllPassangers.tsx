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
            <p className="text-amber-600 text-sm font-medium tracking-wide mb-3">Passenger Management</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              All <span className="text-amber-600">Passengers</span>
            </h1>
          </div>
          <div className="flex items-center gap-6 bg-card border border-border px-10 py-5 rounded-[32px] shadow-2xl shadow-slate-900/[0.03] backdrop-blur-xl">
             <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-amber-500" />
             </div>
             <div>
                <span className="text-foreground text-lg font-semibold block leading-none mb-1">{passengers.length} Passengers</span>
                <span className="text-muted-foreground text-sm font-medium opacity-50">Active registry</span>
             </div>
          </div>
        </div>

        {passengers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 bg-card border border-border border-dashed rounded-[48px] grayscale opacity-40">
             <Database className="w-24 h-24 text-muted-foreground/20 mb-8" />
             <p className="text-foreground font-bold text-xl tracking-tight mb-3">No passengers found</p>
             <p className="text-muted-foreground text-base font-normal">Start by adding new passengers</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {passengers.map((p: any) => (
              <div key={p.id} className="group bg-card border border-border rounded-[48px] p-10 hover:border-amber-500/30 transition-all duration-700 hover:shadow-2xl hover:shadow-slate-900/[0.05] relative overflow-hidden flex flex-col">
                <div className="flex items-center gap-6 mb-10 relative z-10">
                  <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 font-bold text-3xl group-hover:scale-110 transition-transform duration-700 shadow-2xl group-hover:rotate-3">
                    {p.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-foreground font-bold text-xl tracking-tight leading-none mb-3 group-hover:text-amber-500 transition-colors duration-500">{p.name}</h3>
                    <span className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-500 ${p.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}>
                      {p.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-6 mb-10 p-8 bg-muted/30 border border-border/50 rounded-[32px] group-hover:bg-muted/50 transition-colors duration-700 relative overflow-hidden">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-muted rounded-xl">
                       <Mail className="w-4 h-4 text-amber-600 opacity-60" />
                    </div>
                    <span className="text-muted-foreground text-sm font-medium truncate">{p.email}</span>
                  </div>
                  {p.phone && (
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-muted rounded-xl">
                         <Phone className="w-4 h-4 text-amber-600 opacity-60" />
                      </div>
                      <span className="text-muted-foreground text-sm font-medium">{p.phone}</span>
                    </div>
                  )}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/5 to-transparent rounded-full -mr-12 -mt-12" />
                </div>

                <div className="pt-10 border-t border-border/50 flex items-center justify-between mt-auto">
                  <div className="flex flex-col gap-2">
                     <p className="text-muted-foreground text-xs font-medium opacity-50 leading-none">Joined</p>
                     <span className="text-foreground font-semibold text-sm leading-none">{new Date(p.createdAt).toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
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
                       <span className={`text-xs font-medium ${p.isVerified ? 'text-emerald-600' : 'text-muted-foreground/50'}`}>
                          {p.isVerified ? 'Verified' : 'Pending'}
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
          <p className="text-muted-foreground text-sm font-medium opacity-50">Managing <span className="text-foreground font-semibold">{passengers.length}</span> passengers</p>
        </div>
      </div>
    </section>
  );
}