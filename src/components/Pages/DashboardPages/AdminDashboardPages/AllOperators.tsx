import { getAllUsers } from '@/src/services/dashboard-services/operators';
import { Mail, Phone, Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function AllOperators() {
  const res = await getAllUsers('OPERATOR');
  const operators = (res.data ?? []).filter((u: any) => u.role === 'OPERATOR');

  return (
    <div className="min-h-screen bg-[#050d1a] relative overflow-hidden p-6 lg:p-12">
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(255,180,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,180,0,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">— Management</p>
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-2">
              All <span className="text-amber-400">Operators</span>
            </h1>
            <p className="text-slate-400 text-lg">Total {operators.length} operators</p>
          </div>
          <Link href="/admin-dashboard/create-operator">
            <Button className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-wider shadow-lg shadow-amber-400/10">
              <Plus className="w-4 h-4" /> Create Operator
            </Button>
          </Link>
        </div>

        {operators.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-slate-500 text-lg">No operators found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {operators.map((op: any) => (
              <div key={op.id} className="group bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-amber-400/30 transition-colors duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 font-black text-lg">
                    {op.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight">{op.name}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${op.status === 'ACTIVE' ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                      {op.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4 p-3 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-300">{op.email}</span>
                  </div>
                  {op.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-300">{op.phone}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-500">
                  <span>Joined {new Date(op.createdAt).toLocaleDateString('en-BD')}</span>
                  <div className="flex items-center gap-3">
                    <span className={op.isVerified ? 'text-green-400' : 'text-slate-500'}>
                      {op.isVerified ? '✓ Verified' : 'Unverified'}
                    </span>
                    <Link href={`/admin-dashboard/operators/${op.id}`}>
                      <Button size="sm" className="bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs h-7 px-3 rounded-lg">
                        Details <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}