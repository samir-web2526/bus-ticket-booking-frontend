'use client';

import { useState, useEffect } from 'react';
import {
  Shield, CheckCircle, XCircle,
  Building2,
  Pencil, Loader2, ArrowLeft,
  User, Calendar, RefreshCw, Trash2, Zap, Activity, ShieldCheck, Database, Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUserById, deleteUser } from '@/src/services/user.service';
import EditOperatorModal from './EditOperatorModal';

interface OperatorProfile {
  id: string;
  userId: string;
  companyName: string;
  tradeLicense: string;
  nid: string;
  address: string;
}

interface Operator {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  isVerified: boolean;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
  operatorProfile?: OperatorProfile | null | undefined;
}

function StatCard({ icon, label, value, accent = false }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={`p-8 rounded-[32px] border flex flex-col gap-6 transition-all duration-500 group ${accent ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-slate-900/20' : 'bg-card border-border hover:border-amber-500/30 shadow-sm'}`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${accent ? 'bg-amber-500 text-white' : 'bg-muted text-amber-500'}`}>
        {icon}
      </div>
      <div>
        <p className={`text-xs font-medium mb-2 ${accent ? 'text-amber-500/70' : 'text-muted-foreground opacity-60'}`}>{label}</p>
        <p className={`font-bold text-xl tracking-tight leading-none ${accent ? 'text-white' : 'text-foreground'}`}>{value}</p>
      </div>
    </div>
  );
}

function InfoCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-border rounded-[48px] overflow-hidden shadow-2xl shadow-slate-900/[0.02] group"
    >
      <div className="px-10 py-6 border-b border-border/50 flex items-center gap-5 bg-muted/10">
        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 shadow-lg group-hover:rotate-6 transition-transform">
          {icon}
        </div>
        <p className="text-foreground font-semibold text-base tracking-tight">{title}</p>
      </div>
      <div className="p-10 space-y-2">{children}</div>
    </motion.div>
  );
}

function FieldRow({ label, value, highlight }: { label: string; value: string | null, highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-6 py-4 border-b border-border/40 last:border-0 group/row">
      <p className="text-xs font-medium text-muted-foreground shrink-0 opacity-60">{label}</p>
      <p className={`text-base font-medium transition-colors ${highlight ? 'text-amber-500' : 'text-foreground group-hover/row:text-amber-500'}`}>{value ?? 'Not provided'}</p>
    </div>
  );
}

export default function OperatorDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const [operator, setOperator] = useState<Operator | null>(null);
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
        setOperator(res.data);
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
      const res = await deleteUser(operator!.id);
      if (res.error) {
        toast.error(res.error);
        setDeleteLoading(false);
        return;
      }
      toast.success('Operator deleted successfully!');
      setDeleteDialog(false);
      router.push('/admin-dashboard/operators');
      router.refresh();
    } catch (err) {
      console.error('[handleDelete]', err);
      toast.error('Something went wrong');
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="relative">
           <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full" />
           <Loader2 className="h-20 w-20 text-amber-500 animate-spin relative z-10" />
        </div>
        <p className="text-muted-foreground font-medium text-base animate-pulse mt-10">Loading operator details...</p>
      </div>
    );
  }

  if (error || !operator) {
    return (
      <div className="min-h-screen bg-background py-24 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/admin-dashboard/operators" className="inline-flex items-center gap-4 text-muted-foreground hover:text-foreground text-base font-medium mb-12 transition-all group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform text-amber-500" /> Back to Operators
          </Link>
          <div className="flex items-center justify-center h-96 bg-card border border-border rounded-[56px] shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            <div className="text-center relative z-10">
              <Activity className="h-16 w-16 text-destructive mx-auto mb-8 animate-pulse" />
              <h3 className="text-2xl font-bold text-foreground mb-4 tracking-tight">Error</h3>
              <p className="text-muted-foreground font-normal text-base">{error || 'Operator not found'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const op = operator.operatorProfile;

  return (
    <section className="min-h-screen bg-background relative overflow-hidden p-6 lg:p-12">
      {/* Dynamic Background */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-amber-500/[0.03] rounded-full blur-[140px] -z-10" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-slate-500/[0.03] rounded-full blur-[140px] -z-10" />

      <div className="max-w-6xl mx-auto relative z-10">
        <Link href="/admin-dashboard/operators" className="inline-flex items-center gap-4 text-muted-foreground hover:text-foreground text-base font-medium mb-12 transition-all group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform text-amber-500" /> Back to Operators
        </Link>

        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-card border border-border rounded-[56px] overflow-hidden mb-12 shadow-2xl shadow-slate-900/[0.03] group"
        >
          <div className="h-48 bg-gradient-to-r from-muted/50 via-muted/20 to-transparent relative overflow-hidden">
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          </div>

          <div className="px-12 pb-12">
            <div className="-mt-20 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
              <div className="flex items-end gap-8 relative z-10">
                {operator.profileImage ? (
                  <img src={operator.profileImage} alt={operator.name}
                    className="w-40 h-40 rounded-[40px] object-cover border-8 border-card shadow-2xl group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-40 h-40 rounded-[40px] bg-slate-900 border-8 border-card flex items-center justify-center text-amber-500 font-bold text-6xl shadow-2xl group-hover:scale-105 transition-transform duration-700">
                    {operator.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="pb-4">
                  <div className="flex items-center gap-5 mb-4 flex-wrap">
                    <h1 className="text-foreground font-bold text-3xl lg:text-4xl tracking-tight leading-none">{operator.name}</h1>
                    <span className={`text-sm font-medium px-4 py-2 rounded-full border shadow-lg ${operator.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}>
                      {operator.status}
                    </span>
                    {operator.isVerified && (
                      <span className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full">
                        <CheckCircle className="w-4 h-4" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm font-medium opacity-60 leading-none">{operator.email}</p>
                  {op?.companyName && (
                    <p className="text-amber-600 text-sm font-semibold mt-3 opacity-90">{op.companyName}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap mb-4">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: '#0f172a', color: '#fff' }} 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-3 bg-slate-900 border border-slate-800 text-white font-semibold px-6 py-3 rounded-2xl text-base shadow-xl shadow-slate-900/20 group/btn"
                >
                  <Pencil className="w-4 h-4 text-amber-500 group-hover/btn:rotate-12 transition-transform" /> Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.1)' }} 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDeleteDialog(true)}
                  className="flex items-center gap-3 bg-destructive/5 border border-destructive/20 text-destructive font-semibold px-6 py-3 rounded-2xl text-base transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
        >
          <StatCard icon={<Shield className="w-5 h-5" />} label="Authority" value={operator.role} accent />
          <StatCard
            icon={operator.isVerified ? <ShieldCheck className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
            label="Integrity"
            value={operator.isVerified ? 'VERIFIED' : 'PENDING'}
          />
          <StatCard
            icon={<Calendar className="w-5 h-5" />}
            label="Enlisted"
            value={new Date(operator.createdAt).toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}
          />
          <StatCard
            icon={<RefreshCw className="w-5 h-5" />}
            label="Last Sync"
            value={new Date(operator.updatedAt).toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <InfoCard title="Personnel Diagnostics" icon={<User className="w-5 h-5" />}>
            <FieldRow label="Full Designation" value={operator.name} />
            <FieldRow label="Uplink Protocol" value={operator.email} />
            <FieldRow label="Frequency Signal" value={operator.phone} />
          </InfoCard>

          {op && (
            <InfoCard title="Corporate Registry" icon={<Building2 className="w-5 h-5" />}>
              <FieldRow label="Entity Name" value={op.companyName} />
              <FieldRow label="Trade Vector" value={op.tradeLicense} />
              <FieldRow label="Auth Cipher" value={op.nid} />
              <FieldRow label="Node Location" value={op.address} />
            </InfoCard>
          )}
        </div>
        
        {/* Technical Detail Footer */}
        <div className="mt-24 pt-12 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[24px] bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 shadow-2xl">
                 <Zap className="w-8 h-8 fill-amber-500" />
              </div>
              <div>
                 <p className="text-xs font-medium text-muted-foreground opacity-60 mb-1">User ID</p>
                 <p className="text-foreground font-semibold text-base tracking-tight">{operator.id}</p>
              </div>
           </div>
           <div className="flex items-center gap-4 text-muted-foreground/40 text-sm font-medium">
              <Database className="w-4 h-4" /> Secure operator profile
           </div>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <EditOperatorModal
            operator={operator}
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onUpdated={(updated) => setOperator(updated as Operator)}
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
              <p className="text-destructive text-sm font-medium mb-3">Delete Operator</p>
              <h2 className="text-foreground font-bold text-3xl mb-4 tracking-tight leading-tight">Delete <span className="text-destructive">{operator.name}</span>?</h2>
              <p className="text-muted-foreground text-base mb-10 font-normal">Are you sure you want to permanently delete this operator? This action cannot be undone.</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteDialog(false)}
                  disabled={deleteLoading}
                  className="flex-1 bg-muted/40 text-muted-foreground hover:bg-muted/60 rounded-2xl h-14 font-semibold text-base transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex-[1.5] bg-destructive hover:bg-destructive/90 disabled:opacity-50 text-white font-semibold h-14 rounded-2xl transition-all flex items-center justify-center gap-3 text-base shadow-xl shadow-destructive/20"
                >
                  {deleteLoading
                    ? <><Activity className="w-5 h-5 animate-spin" /> Deleting...</>
                    : <><Trash2 className="w-5 h-5" /> Delete Operator</>
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