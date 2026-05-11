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
  User as UserIcon,
  Fingerprint,
  CalendarDays,
  Clock
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

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null }) {
  return (
    <div className="p-6 bg-muted/30 border border-border/50 rounded-[24px] flex items-center gap-5 group hover:bg-muted transition-all duration-300">
      <div className="w-12 h-12 bg-card border border-border rounded-2xl flex items-center justify-center shrink-0 text-muted-foreground group-hover:text-amber-600 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-1 opacity-70">{label}</p>
        <p className="text-foreground text-base font-medium">{value ?? 'Not provided'}</p>
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
      <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/[0.02] rounded-full blur-[120px] -z-10" />
         <div className="w-12 h-12 border-4 border-muted border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/[0.02] rounded-full blur-[120px] -z-10" />
         <div className="bg-card border border-destructive/20 p-8 rounded-[32px] text-center max-w-md w-full shadow-2xl">
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4 opacity-50" />
            <p className="text-destructive font-medium text-base">{error || 'Failed to load profile'}</p>
         </div>
      </div>
    );
  }

  const passenger = user.passengerProfile;

  return (
    <section className="bg-background min-h-screen py-24 px-6 lg:px-12 relative overflow-hidden">
      {/* Decorative bg blobs */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-amber-500/[0.02] rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-slate-500/[0.02] rounded-full blur-[120px] -z-10" />

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-amber-600 text-sm font-medium tracking-wide mb-3">My Profile</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Personal <span className="text-amber-600">Information</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card border border-border rounded-[48px] overflow-hidden shadow-2xl shadow-slate-900/[0.03]"
        >
          {/* Cover Area */}
          <div className="h-40 bg-slate-900 relative">
             <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent" />
             <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-900 to-transparent" />
             <div className="absolute top-8 right-8 flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2 rounded-full shadow-2xl">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-white">Active session</span>
             </div>
          </div>

          <div className="px-10 pb-12 relative">
            {/* Avatar + Status */}
            <div className="-mt-12 mb-10 flex items-end justify-between relative z-20">
              <div className="relative group">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-24 h-24 rounded-[32px] object-cover border-[6px] border-card shadow-2xl group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-[32px] bg-muted border-[6px] border-card shadow-2xl flex items-center justify-center text-muted-foreground font-bold text-4xl group-hover:bg-slate-900 group-hover:text-amber-500 transition-all duration-500">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-500 rounded-2xl flex items-center justify-center border-4 border-card shadow-xl">
                   <Shield className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              <span className={`text-sm font-medium px-4 py-2 rounded-full border shadow-sm ${
                  user.status === 'ACTIVE'
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                    : 'bg-destructive/10 text-destructive border-destructive/20'
                }`}
              >
                {user.status} Operator
              </span>
            </div>

            {/* Name + email */}
            <div className="mb-12">
               <h2 className="text-foreground font-bold text-3xl tracking-tight mb-1 leading-none">{user.name}</h2>
               <p className="text-muted-foreground text-sm font-medium opacity-70">User ID: {user.id.slice(0, 16)}</p>
            </div>

            {/* Grid Sections */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Account Info */}
              <div className="space-y-6">
                <p className="text-amber-600 text-sm font-medium uppercase tracking-wide mb-4 border-b border-border pb-4">
                  Account Information
                </p>
                <div className="space-y-4">
                  <InfoRow icon={<Mail className="w-5 h-5" />} label="Email" value={user.email} />
                  <InfoRow icon={<Phone className="w-5 h-5" />} label="Phone Number" value={user.phone} />
                  <InfoRow icon={<Fingerprint className="w-5 h-5" />} label="Account Role" value={user.role} />

                  <div className="p-6 bg-muted/30 border border-border/50 rounded-[24px] flex items-center gap-5">
                    <div className={`w-12 h-12 bg-card border border-border rounded-2xl flex items-center justify-center shrink-0 ${user.isVerified ? 'text-emerald-500' : 'text-destructive'}`}>
                       {user.isVerified ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1 opacity-70">Verification Status</p>
                      <p className={`text-base font-semibold ${user.isVerified ? 'text-emerald-600' : 'text-destructive'}`}>
                        {user.isVerified ? 'Verified' : 'Not Verified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passenger Info */}
              <div className="space-y-6">
                <p className="text-amber-600 text-sm font-medium uppercase tracking-wide mb-4 border-b border-border pb-4">
                  Personal Details
                </p>
                <div className="space-y-4">
                   {passenger ? (
                     <>
                      <InfoRow
                        icon={<Venus className="w-5 h-5" />}
                        label="Gender"
                        value={passenger.gender ? passenger.gender.charAt(0).toUpperCase() + passenger.gender.slice(1) : null}
                      />
                      <InfoRow
                        icon={<Cake className="w-5 h-5" />}
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
                        icon={<HeartPulse className="w-5 h-5" />}
                        label="Emergency Contact"
                        value={passenger.emergencyContact}
                      />
                     </>
                   ) : (
                      <div className="h-full flex flex-col items-center justify-center bg-muted/20 border border-border border-dashed rounded-[24px] p-8 text-center">
                         <UserIcon className="w-10 h-10 text-muted-foreground/20 mb-4" />
                         <p className="text-sm font-medium text-muted-foreground">No additional information available</p>
                      </div>
                   )}
                </div>
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="pt-10 border-t border-border flex flex-col sm:flex-row justify-between gap-4 opacity-50">
              <div className="flex items-center gap-2">
                 <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
                 <span className="text-sm font-medium text-muted-foreground">
                    Member since: {new Date(user.createdAt).toLocaleDateString('en-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
                 </span>
              </div>
              <div className="flex items-center gap-2">
                 <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                 <span className="text-sm font-medium text-muted-foreground">
                    Last updated: {new Date(user.updatedAt).toLocaleDateString('en-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
                 </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}