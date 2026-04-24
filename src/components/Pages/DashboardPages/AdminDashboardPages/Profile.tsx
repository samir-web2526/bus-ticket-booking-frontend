import { getProfile } from '@/src/services/dashboard-services/profile';
import { Mail, Phone, Shield, CheckCircle, XCircle } from 'lucide-react';

export default async function Profile() {
  const res = await getProfile();
  const user = res.data;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050d1a] flex items-center justify-center">
        <p className="text-red-400">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050d1a] relative overflow-hidden p-6 lg:p-12">
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(255,180,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,180,0,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl -z-10" />

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="mb-10">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">— Account</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white">My Profile</h1>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
          {/* Top Banner */}
          <div className="h-24 bg-gradient-to-r from-amber-500/20 to-amber-400/5 border-b border-white/10" />

          {/* Avatar + Name */}
          <div className="px-8 pb-8">
            <div className="-mt-10 mb-6 flex items-end justify-between">
              <div className="w-20 h-20 rounded-2xl bg-amber-400/10 border-2 border-amber-400/30 flex items-center justify-center text-amber-400 font-black text-3xl">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  user.status === 'ACTIVE'
                    ? 'bg-green-400/10 text-green-400 border-green-400/20'
                    : 'bg-red-400/10 text-red-400 border-red-400/20'
                }`}>
                  {user.status}
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
                  {user.role}
                </span>
              </div>
            </div>

            <h2 className="text-white font-black text-2xl mb-1">{user.name}</h2>
            <p className="text-slate-400 text-sm mb-8">{user.email}</p>

            {/* Info Grid */}
            <div className="space-y-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <p className="text-slate-500 text-xs">Email</p>
                  <p className="text-white text-sm font-semibold">{user.email}</p>
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <p className="text-slate-500 text-xs">Phone</p>
                  <p className="text-white text-sm font-semibold">{user.phone ?? 'Not provided'}</p>
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <p className="text-slate-500 text-xs">Role</p>
                  <p className="text-white text-sm font-semibold">{user.role}</p>
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                {user.isVerified
                  ? <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  : <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                }
                <div>
                  <p className="text-slate-500 text-xs">Verification</p>
                  <p className={`text-sm font-semibold ${user.isVerified ? 'text-green-400' : 'text-red-400'}`}>
                    {user.isVerified ? 'Verified' : 'Not Verified'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 text-xs text-slate-500 flex justify-between">
              <span>Joined {new Date(user.createdAt).toLocaleDateString('en-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span>Updated {new Date(user.updatedAt).toLocaleDateString('en-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}