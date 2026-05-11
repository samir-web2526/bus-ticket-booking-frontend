'use client'

import { useState, useEffect } from 'react';
import { getProfile } from '@/src/services/dashboard-services/profile';
import {
  Mail,
  Phone,
  Shield,
  CheckCircle,
  XCircle,
  Building2,
  FileText,
  CreditCard,
  MapPin,
  Calendar,
  RefreshCw,
  Activity,
  Zap,
  Database,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface OperatorProfile {
  id: string;
  userId: string;
  companyName: string;
  tradeLicense: string;
  nid: string;
  address: string;
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
  operatorProfile: OperatorProfile | null;
}

function InfoRow({ icon, value, label }: { icon: React.ReactNode; value: string | null; label: string }) {
  return (
    <div className="p-6 bg-muted/20 border border-border/40 rounded-[32px] flex items-center gap-6 group hover:bg-muted/30 transition-all duration-500">
      <div className="shrink-0 w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 shadow-lg group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground opacity-60 mb-1 leading-none">{label}</p>
        <p className="text-foreground text-base font-medium transition-colors group-hover:text-amber-500">{value ?? 'Not provided'}</p>
      </div>
    </div>
  );
}

export default function OperatorProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfile();
        if (res.error) { setError(res.error); return; }
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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="relative">
           <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full" />
           <Loader2 className="h-20 w-20 text-amber-500 animate-spin relative z-10" />
        </div>
        <p className="text-muted-foreground font-medium text-base animate-pulse mt-10">Loading profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="bg-card border border-border rounded-[48px] p-16 text-center max-w-md shadow-2xl">
          <Activity className="w-16 h-16 text-destructive mx-auto mb-8 animate-pulse" />
          <h3 className="text-2xl font-bold text-foreground tracking-tight mb-4">Error</h3>
          <p className="text-muted-foreground text-base font-normal">{error || 'Failed to load profile'}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-background min-h-screen py-24 px-6 lg:px-12 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-amber-500/[0.03] rounded-full blur-[140px] -z-10" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-slate-500/[0.03] rounded-full blur-[140px] -z-10" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-amber-600 text-sm font-medium tracking-wide mb-3">My Profile</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Operator <span className="text-amber-600">Profile</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card border border-border rounded-[56px] overflow-hidden shadow-2xl shadow-slate-900/[0.03] group"
        >
          <div className="h-48 bg-gradient-to-r from-muted/50 via-muted/20 to-transparent relative overflow-hidden">
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          </div>

          <div className="px-12 pb-12">
            {/* Avatar + Status */}
            <div className="-mt-20 mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
              <div className="flex items-end gap-8 relative z-10">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-40 h-40 rounded-[40px] object-cover border-8 border-card shadow-2xl group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-[40px] bg-slate-900 border-8 border-card flex items-center justify-center text-amber-500 font-bold text-6xl shadow-2xl group-hover:scale-105 transition-transform duration-700">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="pb-4">
                  <h2 className="text-foreground font-bold text-3xl lg:text-4xl tracking-tight leading-none mb-3">{user.name}</h2>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-muted-foreground text-sm font-medium opacity-70 leading-none">{user.email}</span>
                    <div className="h-1 w-1 rounded-full bg-border" />
                    <span className="text-amber-600 text-sm font-semibold opacity-90 leading-none">{user.role}</span>
                  </div>
                </div>
              </div>
              
              <div className="pb-4">
                <span className={`text-sm font-medium px-5 py-2 rounded-full border shadow-lg ${user.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}>
                  Status: {user.status}
                </span>
              </div>
            </div>

            {/* Account Info Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="space-y-6">
                 <p className="text-amber-600 text-sm font-medium tracking-wide ml-2 opacity-80">Contact Information</p>
                 <div className="space-y-4">
                    <InfoRow icon={<Mail className="w-5 h-5" />} label="Email" value={user.email} />
                    <InfoRow icon={<Phone className="w-5 h-5" />} label="Phone" value={user.phone} />
                    <InfoRow icon={<Shield className="w-5 h-5" />} label="Role" value={user.role} />
                 </div>
              </div>

              <div className="space-y-6">
                 <p className="text-amber-600 text-sm font-medium tracking-wide ml-2 opacity-80">Account Status</p>
                 <div className="space-y-4">
                    <div className="p-8 bg-muted/10 border border-border/40 rounded-[32px] flex items-center justify-between group hover:bg-muted/20 transition-all duration-500">
                      <div className="flex items-center gap-6">
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${user.isVerified ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-emerald-500/10' : 'bg-destructive/10 text-destructive border border-destructive/20 shadow-destructive/10'}`}>
                           {user.isVerified ? <ShieldCheck className="w-6 h-6" /> : <Activity className="w-6 h-6 animate-pulse" />}
                         </div>
                         <div>
                           <p className="text-xs font-medium text-muted-foreground opacity-60 mb-1 leading-none">Verification</p>
                           <p className={`text-base font-semibold transition-colors ${user.isVerified ? 'text-emerald-600' : 'text-destructive'}`}>
                             {user.isVerified ? 'Verified' : 'Not Verified'}
                           </p>
                         </div>
                      </div>
                      {user.isVerified && <CheckCircle className="w-5 h-5 text-emerald-500 opacity-20" />}
                    </div>

                    <div className="p-8 bg-slate-900 border border-slate-800 rounded-[32px] relative overflow-hidden group shadow-2xl shadow-slate-900/20">
                       <div className="relative z-10 flex items-center justify-between">
                          <div className="flex items-center gap-6">
                             <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-lg">
                                <Zap className="w-6 h-6 fill-amber-500" />
                             </div>
                             <div>
                                <p className="text-xs font-medium text-amber-500/60 mb-1 leading-none">User ID</p>
                                <p className="text-white font-semibold text-base tracking-tight leading-none">{user.id}</p>
                             </div>
                          </div>
                          <Database className="w-6 h-6 text-white opacity-5" />
                       </div>
                       <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                    </div>
                 </div>
              </div>
            </div>

            {/* Operator Information */}
            {user.operatorProfile && (
              <div className="mb-16">
                 <p className="text-amber-600 text-sm font-medium tracking-wide ml-2 opacity-80 mb-6">Operator Information</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow icon={<Building2 className="w-5 h-5" />} label="Company Name" value={user.operatorProfile.companyName} />
                    <InfoRow icon={<FileText className="w-5 h-5" />} label="Trade License" value={user.operatorProfile.tradeLicense} />
                    <InfoRow icon={<CreditCard className="w-5 h-5" />} label="National ID" value={user.operatorProfile.nid} />
                    <InfoRow icon={<MapPin className="w-5 h-5" />} label="Address" value={user.operatorProfile.address} />
                 </div>
              </div>
            )}

            {/* Footer Metadata */}
            <div className="pt-12 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-10">
               <div className="flex items-center gap-8">
                  <div className="flex items-center gap-4">
                     <Calendar className="w-4 h-4 text-muted-foreground opacity-30" />
                     <p className="text-muted-foreground text-sm font-medium opacity-60">Member since: <span className="text-foreground opacity-100">{new Date(user.createdAt).toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: 'numeric' })}</span></p>
                  </div>
                  <div className="flex items-center gap-4">
                     <RefreshCw className="w-4 h-4 text-muted-foreground opacity-30" />
                     <p className="text-muted-foreground text-sm font-medium opacity-60">Last updated: <span className="text-foreground opacity-100">{new Date(user.updatedAt).toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: 'numeric' })}</span></p>
                  </div>
               </div>
               
               <div className="flex items-center gap-4 text-muted-foreground/40 text-sm font-medium">
                  <Shield className="w-4 h-4" /> Secure operator profile
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}