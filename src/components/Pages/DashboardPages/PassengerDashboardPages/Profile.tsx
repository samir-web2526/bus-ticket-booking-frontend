'use client'

import { useState, useEffect } from 'react';
import { getProfile } from '@/src/services/dashboard-services/profile';
import {
  Mail,
  Phone,
  Shield,
  CheckCircle,
  XCircle,
  HeartPulse,
  Cake,
  Venus,
  Pencil
} from 'lucide-react';
import { motion } from 'framer-motion';

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
    </div>
  );
}