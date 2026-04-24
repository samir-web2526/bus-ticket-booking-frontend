
import { getAllUsers } from '@/src/services/dashboard-services/operators';
import { Mail, Phone } from 'lucide-react';

export default async function AllPassengers() {
  const res = await getAllUsers('PASSENGER');
  const passengers = (res.data ?? []).filter((u: any) => u.role === 'PASSENGER'); // ✅ frontend filter

  return (
    <div className="min-h-screen bg-[#050d1a] relative overflow-hidden p-6 lg:p-12">
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(255,180,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,180,0,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-10">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">— Management</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-2">
            All <span className="text-amber-400">Passengers</span>
          </h1>
          <p className="text-slate-400 text-lg">Total {passengers.length} passengers</p>
        </div>

        {passengers.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-slate-500 text-lg">No passengers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {passengers.map((p: any) => (
              <div key={p.id} className="group bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-amber-400/30 transition-colors duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-blue-400 font-black text-lg">
                    {p.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight">{p.name}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.status === 'ACTIVE' ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                      {p.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4 p-3 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-300">{p.email}</span>
                  </div>
                  {p.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-300">{p.phone}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-between text-xs text-slate-500">
                  <span>Joined {new Date(p.createdAt).toLocaleDateString('en-BD')}</span>
                  <span className={p.isVerified ? 'text-green-400' : 'text-slate-500'}>
                    {p.isVerified ? '✓ Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}