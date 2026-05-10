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

function InfoRow({ icon, value }: { icon: React.ReactNode; value: string | null }) {
  return (
    <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-3">
      <div className="shrink-0 text-gray-400">{icon}</div>
      <p className="text-gray-900 text-sm font-semibold">{value ?? 'Not provided'}</p>
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-red-500">{error || 'Failed to load profile'}</p>
      </div>
    );
  }

  const passenger = user.passengerProfile;

  return (
    <section className="bg-white min-h-screen py-24 px-6 lg:px-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gray-100 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-gray-400 text-sm font-semibold tracking-widest uppercase mb-3">— Account</p>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900">
            My <span className="text-gray-500">Profile</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm"
        >
          <div className="h-24 bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-100 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,0,0,0.04),transparent_60%)]" />
          </div>

          <div className="px-8 pb-8">
            {/* Avatar + Status */}
            <div className="-mt-10 mb-6 flex items-end justify-between">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gray-100 border-4 border-white shadow-md flex items-center justify-center text-gray-500 font-black text-3xl">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  user.status === 'ACTIVE'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-red-50 text-red-600 border-red-200'
                }`}
              >
                {user.status}
              </span>
            </div>

            {/* Name + email */}
            <h2 className="text-gray-900 font-black text-2xl mb-1">{user.name}</h2>
            <p className="text-gray-400 text-sm mb-8">{user.email}</p>

            {/* Account Info */}
            <div className="mb-8">
              <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-4">
                Account Information
              </p>
              <div className="space-y-3">
                <InfoRow icon={<Mail className="w-4 h-4" />} value={user.email} />
                <InfoRow icon={<Phone className="w-4 h-4" />} value={user.phone} />
                <InfoRow icon={<Shield className="w-4 h-4" />} value={user.role} />

                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-3">
                  {user.isVerified ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                  <div>
                    <p className="text-gray-400 text-xs mb-0.5">Verification</p>
                    <p className={`text-sm font-semibold ${user.isVerified ? 'text-emerald-600' : 'text-red-500'}`}>
                      {user.isVerified ? 'Verified' : 'Not Verified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger Info */}
            {passenger && (
              <div className="mb-8">
                <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-4">
                  Passenger Information
                </p>
                <div className="space-y-3">
                  <InfoRow
                    icon={<Venus className="w-4 h-4" />}
                    value={passenger.gender ? passenger.gender.charAt(0).toUpperCase() + passenger.gender.slice(1) : null}
                  />
                  <InfoRow
                    icon={<Cake className="w-4 h-4" />}
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
                    value={passenger.emergencyContact}
                  />
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="pt-6 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
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
        </motion.div>
      </div>
    </section>
  );
}