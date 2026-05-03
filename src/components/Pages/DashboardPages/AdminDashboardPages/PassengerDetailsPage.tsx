'use client';

import { useState, useEffect } from 'react';
import {
  Shield, CheckCircle, XCircle,
  Pencil, Loader2, ArrowLeft,
  User, Calendar, RefreshCw, Trash2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUserById, deleteUser } from '@/src/services/user.service';
import EditPassengerModal from './EditPassengerModal'; // 👈 আলাদা ফাইল থেকে import

// ─── Types ────────────────────────────────────────────────────────────────

interface Passenger {
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
}

// ─── Stat Card ────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, accent = false }: {
  icon: React.ReactNode; label: string; value: string; accent?: boolean;
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

// ─── Field Row ────────────────────────────────────────────────────────────

function FieldRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-white/5 last:border-0">
      <p className="text-slate-500 text-xs uppercase tracking-wider shrink-0 pt-0.5">{label}</p>
      <p className="text-white text-sm font-semibold text-right">{value ?? 'Not provided'}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────

export default function PassengerDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const [passenger, setPassenger] = useState<Passenger | null>(null);
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
        setError('Failed to load passenger');
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
      <div className="min-h-screen bg-[#050d1a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !passenger) {
    return (
      <div className="min-h-screen bg-[#050d1a] flex items-center justify-center">
        <p className="text-red-400">{error || 'Passenger not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050d1a] relative overflow-hidden p-6 lg:p-12">
      {/* Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,180,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,180,0,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">

        {/* Back */}
        <Link href="/admin-dashboard/passengers"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 text-sm mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Passengers
        </Link>

        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden mb-6"
        >
          <div className="h-32 bg-gradient-to-r from-blue-500/20 via-blue-400/10 to-transparent relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(96,165,250,0.15),transparent_60%)]" />
          </div>

          <div className="px-8 pb-8">
            <div className="-mt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              {/* Avatar + Name */}
              <div className="flex items-end gap-5">
                {passenger.profileImage ? (
                  <img src={passenger.profileImage} alt={passenger.name}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-[#050d1a] shadow-xl" />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-400/20 to-blue-600/10 border-4 border-[#050d1a] flex items-center justify-center text-blue-400 font-black text-4xl shadow-xl">
                    {passenger.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="pb-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h1 className="text-white font-black text-2xl lg:text-3xl">{passenger.name}</h1>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${passenger.status === 'ACTIVE' ? 'bg-green-400/10 text-green-400 border-green-400/20' : 'bg-red-400/10 text-red-400 border-red-400/20'}`}>
                      {passenger.status}
                    </span>
                    {passenger.isVerified && (
                      <span className="flex items-center gap-1 text-xs font-bold text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2.5 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">{passenger.email}</p>
                </div>
              </div>

              {/* Edit + Delete buttons */}
              <div className="self-start sm:self-auto flex items-center gap-3">
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

        {/* Stat Pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <StatCard icon={<Shield className="w-4 h-4" />} label="Role" value={passenger.role} accent />
          <StatCard
            icon={passenger.isVerified ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            label="Verification"
            value={passenger.isVerified ? 'Verified' : 'Not Verified'}
          />
          <StatCard
            icon={<Calendar className="w-4 h-4" />}
            label="Joined"
            value={new Date(passenger.createdAt).toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: 'numeric' })}
          />
          <StatCard
            icon={<RefreshCw className="w-4 h-4" />}
            label="Last Updated"
            value={new Date(passenger.updatedAt).toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: 'numeric' })}
          />
        </motion.div>

        {/* Contact Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-400">
              <User className="w-4 h-4" />
            </div>
            <p className="text-white font-bold text-sm uppercase tracking-wider">Contact Info</p>
          </div>
          <div className="p-6">
            <FieldRow label="Full Name" value={passenger.name} />
            <FieldRow label="Email" value={passenger.email} />
            <FieldRow label="Phone" value={passenger.phone} />
          </div>
        </motion.div>
      </div>

      {/* Edit Modal — আলাদা component থেকে আসছে */}
      <EditPassengerModal
        passenger={passenger}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpdated={(updated) => setPassenger(updated as Passenger)}
      />

      {/* Delete Confirm Dialog */}
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
            <h2 className="text-white font-black text-2xl mb-2">Delete Passenger?</h2>
            <p className="text-slate-400 text-sm mb-8">
              Are you sure you want to delete{' '}
              <span className="text-white font-semibold">{passenger.name}</span>?{' '}
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