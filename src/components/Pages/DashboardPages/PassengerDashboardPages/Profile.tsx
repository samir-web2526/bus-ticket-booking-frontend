'use client'

import { useState, useEffect } from 'react';
import { getProfile } from '@/src/services/dashboard-services/profile';
import { updateUser } from '@/src/services/user.service';
import {
  Mail,
  Phone,
  Shield,
  CheckCircle,
  XCircle,
  HeartPulse,
  Cake,
  Venus,
  Pencil,
  Loader2,
  Zap,
  Lock,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────────────

interface PassengerProfile {
  id: string;
  userId: string;
  gender: string | null;
  dateOfBirth: string | null;
  emergencyContact: string | null;
}

interface User {
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
  passengerProfile: PassengerProfile | null;
}

// ─── Styles ────────────────────────────────────────────────────────────────

const inputCls =
  'w-full bg-white/5 border border-white/20 text-white rounded-xl h-11 px-3 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/20 transition-colors placeholder:text-slate-600';

const disabledInputCls =
  'w-full bg-white/5 border border-white/20 text-slate-400 rounded-xl h-11 px-3 cursor-not-allowed opacity-60 placeholder:text-slate-600';

// ─── Edit Modal ────────────────────────────────────────────────────────────

interface EditModalProps {
  user: User;
  open: boolean;
  onClose: () => void;
  onUpdated: (user: User) => void;
}

function EditPassengerModal({ user, open, onClose, onUpdated }: EditModalProps) {
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    gender: user.passengerProfile?.gender || '',
    dateOfBirth: user.passengerProfile?.dateOfBirth
      ? user.passengerProfile.dateOfBirth.split('T')[0]
      : '',
    emergencyContact: user.passengerProfile?.emergencyContact || '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.passengerProfile?.gender || '',
        dateOfBirth: user.passengerProfile?.dateOfBirth
          ? user.passengerProfile.dateOfBirth.split('T')[0]
          : '',
        emergencyContact: user.passengerProfile?.emergencyContact || '',
      });
    }
  }, [open, user]);

  const handleChange = (field: string, value: string) => {
    const editableFields = ['email', 'phone', 'gender', 'dateOfBirth', 'emergencyContact'];
    if (editableFields.includes(field)) {
      setForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        email: form.email,
        phone: form.phone,
        passengerProfile: {
          gender: form.gender,
          dateOfBirth: form.dateOfBirth || null,
          emergencyContact: form.emergencyContact,
        },
      };

      const res = await updateUser(payload);

      if (res.error) {
        toast.error(res.error);
        return;
      }

      toast.success('Profile updated successfully!');

      const updatedUser: User = {
        ...user,
        email: form.email,
        phone: form.phone,
        passengerProfile: user.passengerProfile
          ? {
              ...user.passengerProfile,
              gender: form.gender || null,
              dateOfBirth: form.dateOfBirth || null,
              emergencyContact: form.emergencyContact || null,
            }
          : null,
      };

      onUpdated(updatedUser);
      onClose();
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#050d1a] border border-white/10 text-white max-w-lg rounded-3xl p-0 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <DialogHeader className="px-8 pt-8 pb-5 border-b border-white/10 relative">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-1">
              — Edit Profile
            </p>
            <DialogTitle className="text-white font-black text-2xl">
              Update <span className="text-amber-400">Profile</span>
            </DialogTitle>
            <p className="text-slate-500 text-sm mt-2">Edit your information below</p>
          </motion.div>
        </DialogHeader>

        <div className="px-8 py-6 space-y-6 relative max-h-96 overflow-y-auto">
          {/* Contact Information */}
          <div>
            <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-4 pb-3 border-b border-white/10">
              Contact Information
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-2 flex items-center gap-2">
                  <Lock className="w-3 h-3" /> Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  disabled
                  placeholder="Your full name"
                  className={disabledInputCls}
                />
                <p className="text-slate-500 text-xs mt-1">Contact support to change this field</p>
              </div>

              <div>
                <label className="text-sm font-bold text-amber-400 uppercase tracking-widest block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="text-sm font-bold text-amber-400 uppercase tracking-widest block mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* Passenger Information */}
          <div>
            <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-4 pb-3 border-b border-white/10">
              Passenger Information
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-amber-400 uppercase tracking-widest block mb-2">
                  Gender
                </label>
                <select
                  value={form.gender}
                  onChange={e => handleChange('gender', e.target.value)}
                  className={inputCls}
                >
                  <option value="" className="bg-[#050d1a]">Select gender</option>
                  <option value="male" className="bg-[#050d1a]">Male</option>
                  <option value="female" className="bg-[#050d1a]">Female</option>
                  <option value="other" className="bg-[#050d1a]">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-amber-400 uppercase tracking-widest block mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={e => handleChange('dateOfBirth', e.target.value)}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="text-sm font-bold text-amber-400 uppercase tracking-widest block mb-2">
                  Emergency Contact
                </label>
                <input
                  type="tel"
                  value={form.emergencyContact}
                  onChange={e => handleChange('emergencyContact', e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-8 py-5 border-t border-white/10 gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white rounded-xl h-11"
          >
            Cancel
          </Button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 text-black font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Save Changes
              </>
            )}
          </motion.button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Info Row Component ────────────────────────────────────────────────────

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | null;
}

function InfoRow({ icon, value }: InfoRowProps) {
  return (
    <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
      <div className="shrink-0 text-amber-400">{icon}</div>
      <div className="flex-1">
        <p className="text-white text-sm font-semibold">{value ?? 'Not provided'}</p>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function PassengerProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfile();
        if (res.error) {
          setError(res.error);
          return;
        }
        setUser(res.data as User);
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050d1a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#050d1a] flex items-center justify-center">
        <p className="text-red-400">{error || 'Failed to load profile'}</p>
      </div>
    );
  }

  const passenger = user.passengerProfile;

  return (
    <div className="min-h-screen bg-[#050d1a] relative overflow-hidden p-6 lg:p-12">
      {/* Background Effects */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,180,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,180,0,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">
              — Account
            </p>
            <h1 className="text-4xl lg:text-5xl font-black text-white">
              My <span className="text-amber-400">Profile</span>
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-wider shadow-lg shadow-amber-400/10"
          >
            <Pencil className="w-4 h-4" /> Edit Profile
          </motion.button>
        </div>

        {/* Main Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
          {/* Banner */}
          <div className="h-24 bg-gradient-to-r from-amber-500/20 to-amber-400/5 border-b border-white/10" />

          <div className="px-8 pb-8">
            {/* Avatar + Status */}
            <div className="-mt-10 mb-6 flex items-end justify-between">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400/30"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-amber-400/10 border-2 border-amber-400/30 flex items-center justify-center text-amber-400 font-black text-3xl">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  user.status === 'ACTIVE'
                    ? 'bg-green-400/10 text-green-400 border-green-400/20'
                    : 'bg-red-400/10 text-red-400 border-red-400/20'
                }`}
              >
                {user.status}
              </span>
            </div>

            {/* Name + email */}
            <h2 className="text-white font-black text-2xl mb-1">{user.name}</h2>
            <p className="text-slate-400 text-sm mb-8">{user.email}</p>

            {/* Account Info */}
            <div className="mb-8">
              <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-4">
                Account Information
              </p>
              <div className="space-y-3">
                <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={user.email} />
                <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={user.phone} />
                <InfoRow icon={<Shield className="w-4 h-4" />} label="Role" value={user.role} />
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                  {user.isVerified ? (
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-slate-500 text-xs">Verification</p>
                    <p
                      className={`text-sm font-semibold ${
                        user.isVerified ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {user.isVerified ? 'Verified' : 'Not Verified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger Info */}
            {passenger && (
              <div className="mb-8">
                <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-4">
                  Passenger Information
                </p>
                <div className="space-y-3">
                  <InfoRow
                    icon={<Venus className="w-4 h-4" />}
                    label="Gender"
                    value={passenger.gender ? passenger.gender.charAt(0).toUpperCase() + passenger.gender.slice(1) : null}
                  />
                  <InfoRow
                    icon={<Cake className="w-4 h-4" />}
                    label="Date of Birth"
                    value={
                      passenger.dateOfBirth
                        ? new Date(passenger.dateOfBirth).toLocaleDateString('en-BD', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : null
                    }
                  />
                  <InfoRow
                    icon={<HeartPulse className="w-4 h-4" />}
                    label="Emergency Contact"
                    value={passenger.emergencyContact}
                  />
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="pt-6 border-t border-white/10 text-xs text-slate-500 flex justify-between">
              <span>
                Joined{' '}
                {new Date(user.createdAt).toLocaleDateString('en-BD', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span>
                Updated{' '}
                {new Date(user.updatedAt).toLocaleDateString('en-BD', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditPassengerModal
        user={user}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpdated={setUser}
      />
    </div>
  );
}