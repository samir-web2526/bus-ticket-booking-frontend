'use client';

import { useState, useEffect } from 'react';
import {
  Shield, CheckCircle, XCircle,
  Building2,
  Pencil, Loader2, ArrowLeft,
  User, Calendar, RefreshCw, Trash2,
} from 'lucide-react';
import { motion } from 'framer-motion';
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
    <div className={`p-5 rounded-2xl border flex flex-col gap-3 ${accent ? 'bg-amber-400/5 border-amber-400/20' : 'bg-white/[0.03] border-white/10'}`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ? 'bg-amber-400/15 text-amber-400' : 'bg-white/5 text-slate-400'}`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-xs mb-0.5">{label}</p>
        <p className={`font-bold text-sm leading-snug ${accent ? 'text-amber-400' : 'text-white'}`}>{value}</p>
      </div>
    </div>
  );
}

function InfoCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-400">
          {icon}
        </div>
        <p className="text-white font-bold text-sm uppercase tracking-wider">{title}</p>
      </div>
      <div className="p-6 space-y-1">{children}</div>
    </motion.div>
  );
}

function FieldRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-white/5 last:border-0">
      <p className="text-slate-500 text-xs uppercase tracking-wider shrink-0 pt-0.5">{label}</p>
      <p className="text-white text-sm font-semibold text-right">{value ?? 'Not provided'}</p>
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
        setError('Failed to load operator');
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
      <div className="min-h-screen bg-[#050d1a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !operator) {
    return (
      <div className="min-h-screen bg-[#050d1a] flex items-center justify-center">
        <p className="text-red-400">{error || 'Operator not found'}</p>
      </div>
    );
  }

  const op = operator.operatorProfile;

  return (
    <div className="min-h-screen bg-[#050d1a] relative overflow-hidden p-6 lg:p-12">
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,180,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,180,0,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">

        <Link href="/admin-dashboard/operators"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 text-sm mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Operators
        </Link>

        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden mb-6"
        >
          <div className="h-32 bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-transparent relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(251,191,36,0.15),transparent_60%)]" />
          </div>

          <div className="px-8 pb-8">
            <div className="-mt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex items-end gap-5">
                {operator.profileImage ? (
                  <img src={operator.profileImage} alt={operator.name}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-[#050d1a] shadow-xl" />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border-4 border-[#050d1a] flex items-center justify-center text-amber-400 font-black text-4xl shadow-xl">
                    {operator.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="pb-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h1 className="text-white font-black text-2xl lg:text-3xl">{operator.name}</h1>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${operator.status === 'ACTIVE' ? 'bg-green-400/10 text-green-400 border-green-400/20' : 'bg-red-400/10 text-red-400 border-red-400/20'}`}>
                      {operator.status}
                    </span>
                    {operator.isVerified && (
                      <span className="flex items-center gap-1 text-xs font-bold text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2.5 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">{operator.email}</p>
                  {op?.companyName && (
                    <p className="text-amber-400/70 text-xs mt-0.5 font-medium">{op.companyName}</p>
                  )}
                </div>
              </div>

              <div className="self-start sm:self-auto flex items-center gap-3 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-wider shadow-lg shadow-amber-400/10"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setDeleteDialog(true)}
                  className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-wider transition-all"
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
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <StatCard icon={<Shield className="w-4 h-4" />} label="Role" value={operator.role} accent />
          <StatCard
            icon={operator.isVerified ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            label="Verification"
            value={operator.isVerified ? 'Verified' : 'Not Verified'}
          />
          <StatCard
            icon={<Calendar className="w-4 h-4" />}
            label="Joined"
            value={new Date(operator.createdAt).toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: 'numeric' })}
          />
          <StatCard
            icon={<RefreshCw className="w-4 h-4" />}
            label="Last Updated"
            value={new Date(operator.updatedAt).toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: 'numeric' })}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InfoCard title="Contact Info" icon={<User className="w-4 h-4" />}>
            <FieldRow label="Full Name" value={operator.name} />
            <FieldRow label="Email" value={operator.email} />
            <FieldRow label="Phone" value={operator.phone} />
          </InfoCard>

          {op && (
            <InfoCard title="Company Info" icon={<Building2 className="w-4 h-4" />}>
              <FieldRow label="Company Name" value={op.companyName} />
              <FieldRow label="Trade License" value={op.tradeLicense} />
              <FieldRow label="NID" value={op.nid} />
              <FieldRow label="Address" value={op.address} />
            </InfoCard>
          )}
        </div>
      </div>
      <EditOperatorModal
        operator={operator}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpdated={(updated) => setOperator(updated as Operator)}
      />
      {deleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !deleteLoading && setDeleteDialog(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-[#050d1a] border border-red-500/20 rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-5">
              <Trash2 className="w-6 h-6" />
            </div>
            <p className="text-red-400 text-xs font-semibold tracking-widest uppercase mb-2">— Danger Zone</p>
            <h2 className="text-white font-black text-2xl mb-2">Delete Operator?</h2>
            <p className="text-slate-400 text-sm mb-8">
              Are you sure you want to delete{' '}
              <span className="text-white font-semibold">{operator.name}</span>?{' '}
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteDialog(false)}
                disabled={deleteLoading}
                className="flex-1 border border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white rounded-xl h-11 font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 disabled:opacity-50 text-white font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
              >
                {deleteLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting…</>
                  : <><Trash2 className="w-4 h-4" /> Delete</>
                }
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}