'use client';

import { useState, useEffect } from 'react';
import {
  Shield, CheckCircle, XCircle,
  Pencil, Loader2, ArrowLeft,
  User, Calendar, RefreshCw, Trash2, Zap, Activity, ShieldCheck, Database, Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUserById, deleteUser, type User as UserType } from '@/src/services/user.service';
import EditPassengerModal from './EditPassengerModal';

function StatCard({ icon, label, value, accent = false }: {
  icon: React.ReactNode; label: string; value: string; accent?: boolean;
}) {
  return (
    <div className={`p-8 rounded-[32px] border flex flex-col gap-6 transition-all duration-500 group ${accent ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-slate-900/20' : 'bg-card border-border hover:border-amber-500/30 shadow-sm'}`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${accent ? 'bg-amber-500 text-white' : 'bg-muted text-amber-500'}`}>
        {icon}
      </div>
      <div>
        <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-2 italic ${accent ? 'text-amber-500/60' : 'text-muted-foreground opacity-40'}`}>{label}</p>
        <p className={`font-black text-xl font-heading tracking-tighter italic uppercase leading-none ${accent ? 'text-white' : 'text-foreground'}`}>{value}</p>
      </div>
    </div>
  );
}

function FieldRow({ label, value, highlight }: { label: string; value: string | null, highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-6 py-4 border-b border-border/40 last:border-0 group/row">
      <p className="text-muted-foreground text-[9px] font-black uppercase tracking-[0.3em] shrink-0 opacity-40 italic">{label}</p>
      <p className={`text-sm font-black uppercase tracking-tight italic transition-colors ${highlight ? 'text-amber-500' : 'text-foreground group-hover/row:text-amber-500'}`}>{value ?? 'NOT PROVIDED'}</p>
    </div>
  );
}

export default function PassengerDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const [passenger, setPassenger] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getUserById(id);
        if (res.error) { setError(res.error); return; }
        setPassenger(res.data);
      } catch {
        setError('FAILED TO LOAD PERSONNEL DIAGNOSTICS');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const res = await deleteUser(passenger!.id);
      if (res.error) { toast.error(res.error); return; }
      toast.success('Passenger deleted successfully!');
      router.push('/admin-dashboard/passengers');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setDeleteLoading(false);
      setDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="relative">
           <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full" />
           <Loader2 className="h-20 w-20 text-amber-500 animate-spin relative z-10" />
        </div>
        <p className="text-muted-foreground font-black uppercase tracking-[0.4em] text-[10px] animate-pulse mt-10 italic">Initializing Personnel Network...</p>
      </div>
    );
  }

  if (error || !passenger) {
    return (
      <div className="min-h-screen bg-background py-24 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/admin-dashboard/passengers" className="inline-flex items-center gap-4 text-muted-foreground hover:text-foreground text-[10px] font-black uppercase tracking-widest mb-12 transition-all group italic">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform text-amber-500" /> BACK TO REGISTRY
          </Link>
          <div className="flex items-center justify-center h-96 bg-card border border-border rounded-[56px] shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            <div className="text-center relative z-10">
              <Activity className="h-16 w-16 text-destructive mx-auto mb-8 animate-pulse" />
              <h3 className="text-3xl font-black text-foreground mb-4 font-heading italic tracking-tighter uppercase leading-none">Diagnostic Error</h3>
              <p className="text-muted-foreground font-medium italic">{error || 'PASSENGER NOT FOUND'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-background relative overflow-hidden p-6 lg:p-12">
      {/* Dynamic Background */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-blue-500/[0.03] rounded-full blur-[140px] -z-10" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-slate-500/[0.03] rounded-full blur-[140px] -z-10" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/admin-dashboard/passengers" className="inline-flex items-center gap-4 text-muted-foreground hover:text-foreground text-[10px] font-black uppercase tracking-widest mb-12 transition-all group italic">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform text-amber-500" /> BACK TO PERSONNEL REGISTRY
        </Link>

        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="bg-card border border-border rounded-[56px] overflow-hidden mb-12 shadow-2xl shadow-slate-900/[0.03] group"
        >
          <div className="h-48 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent relative overflow-hidden">
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          </div>

          <div className="px-12 pb-12">
            <div className="-mt-20 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">

              <div className="flex items-end gap-8 relative z-10">
                {passenger.profileImage ? (
                  <img src={passenger.profileImage} alt={passenger.name}
                    className="w-40 h-40 rounded-[40px] object-cover border-8 border-card shadow-2xl group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-40 h-40 rounded-[40px] bg-slate-900 border-8 border-card flex items-center justify-center text-blue-500 font-black text-6xl shadow-2xl group-hover:scale-105 transition-transform duration-700 italic font-heading">
                    {passenger.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="pb-4">
                  <div className="flex items-center gap-5 mb-4 flex-wrap">
                    <h1 className="text-foreground font-black text-4xl lg:text-5xl font-heading tracking-tighter italic uppercase leading-none">{passenger.name}</h1>
                    <span className={`text-[10px] font-black px-5 py-2 rounded-full border italic tracking-widest uppercase shadow-lg ${passenger.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}>
                      {passenger.status}
                    </span>
                    {passenger.isVerified && (
                      <span className="flex items-center gap-3 text-[10px] font-black text-blue-500 bg-blue-500/10 border border-blue-500/20 px-5 py-2 rounded-full uppercase italic tracking-widest">
                        <CheckCircle className="w-4 h-4" /> VERIFIED
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm font-black uppercase tracking-[0.3em] italic opacity-60 leading-none">{passenger.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap mb-4">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: '#0f172a', color: '#fff' }} 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-4 bg-slate-900 border border-slate-800 text-white font-black px-8 py-4 rounded-[24px] text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/20 italic group/btn"
                >
                  <Pencil className="w-4 h-4 text-amber-500 group-hover/btn:rotate-12 transition-transform" /> MODIFY
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.1)' }} 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDeleteDialog(true)}
                  className="flex items-center gap-4 bg-destructive/5 border border-destructive/20 text-destructive font-black px-8 py-4 rounded-[24px] text-[10px] uppercase tracking-[0.3em] transition-all italic"
                >
                  <Trash2 className="w-4 h-4" /> TERMINATE
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
        >
          <StatCard icon={<Shield className="w-5 h-5" />} label="Authority" value={passenger.role} accent />
          <StatCard
            icon={passenger.isVerified ? <ShieldCheck className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
            label="Integrity"
            value={passenger.isVerified ? 'VERIFIED' : 'PENDING'}
          />
          <StatCard
            icon={<Calendar className="w-5 h-5" />}
            label="Enlisted"
            value={new Date(passenger.createdAt).toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}
          />
          <StatCard
            icon={<RefreshCw className="w-5 h-5" />}
            label="Last Sync"
            value={new Date(passenger.updatedAt).toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-card border border-border rounded-[48px] overflow-hidden shadow-2xl shadow-slate-900/[0.02] group"
        >
          <div className="px-10 py-6 border-b border-border/50 flex items-center gap-5 bg-muted/10">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-500 shadow-lg group-hover:rotate-6 transition-transform">
              <User className="w-5 h-5" />
            </div>
            <p className="text-foreground font-black text-sm uppercase tracking-[0.2em] font-heading italic">Personnel Diagnostics</p>
          </div>
          <div className="p-10">
            <FieldRow label="Full Designation" value={passenger.name} />
            <FieldRow label="Uplink Protocol" value={passenger.email} />
            <FieldRow label="Frequency Signal" value={passenger.phone} />
          </div>
        </motion.div>
        
        {/* Technical Detail Footer */}
        <div className="mt-24 pt-12 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[24px] bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-500 shadow-2xl">
                 <Zap className="w-8 h-8 fill-blue-500" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-40 italic mb-1">Personnel ID Vector</p>
                 <p className="text-foreground font-black font-heading text-lg tracking-tighter italic uppercase">{passenger.id}</p>
              </div>
           </div>
           <div className="flex items-center gap-4 text-muted-foreground/30 text-[9px] font-black uppercase tracking-[0.5em] italic">
              <Database className="w-4 h-4" /> SECURE PERSONNEL DATA ACTIVE
           </div>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <EditPassengerModal
            passenger={passenger}
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onUpdated={(updated) => setPassenger(updated)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => !deleteLoading && setDeleteDialog(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-card border border-border rounded-[48px] p-12 max-w-lg w-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]"
            >
              <div className="w-20 h-20 rounded-[32px] bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mb-8">
                <Trash2 className="w-10 h-10" />
              </div>
              <p className="text-destructive text-[10px] font-black tracking-[0.4em] uppercase mb-4 italic">— DANGER ZONE</p>
              <h2 className="text-foreground font-black text-4xl mb-4 font-heading tracking-tighter italic uppercase leading-tight">TERMINATE <br/><span className="text-destructive">ACCOUNT?</span></h2>
              <p className="text-muted-foreground text-lg mb-10 italic font-medium">Are you sure you want to permanently terminate the account of <span className="text-foreground font-black">{passenger.name}</span>? This action cannot be reversed.</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteDialog(false)}
                  disabled={deleteLoading}
                  className="flex-1 bg-muted/40 text-muted-foreground hover:bg-muted/60 rounded-[24px] h-16 font-black text-[10px] uppercase tracking-[0.2em] transition-all disabled:opacity-50 italic"
                >
                  CANCEL
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex-[1.5] bg-destructive hover:bg-destructive/90 disabled:opacity-50 text-white font-black h-16 rounded-[24px] transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-destructive/20 italic"
                >
                  {deleteLoading
                    ? <><Activity className="w-5 h-5 animate-spin" /> EXECUTING...</>
                    : <><Trash2 className="w-5 h-5" /> CONFIRM EXIT</>
                  }
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}