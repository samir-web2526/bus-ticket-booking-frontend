/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllUsers } from '@/src/services/dashboard-services/operators';
import { Mail, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function AllPassengers() {
  const res = await getAllUsers('PASSENGER');
  const passengers = (res.data ?? []).filter((u: any) => u.role === 'PASSENGER');

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden p-6 lg:p-12">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gray-100 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-10">
          <p className="text-gray-400 text-sm font-semibold tracking-widest uppercase mb-3">— Management</p>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-2">All <span className="text-gray-500">Passengers</span></h1>
          <p className="text-gray-400 text-lg">Total {passengers.length} passengers</p>
        </div>

        {passengers.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-400 text-lg">No passengers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {passengers.map((p: any) => (
              <div key={p.id} className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition-colors duration-300 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-black text-lg">
                    {p.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-bold text-lg leading-tight">{p.name}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4 p-3 bg-gray-50 border border-gray-100 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-700">{p.email}</span>
                  </div>
                  {p.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-700">{p.phone}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                  <span>Joined {new Date(p.createdAt).toLocaleDateString('en-BD')}</span>
                  <div className="flex items-center gap-3">
                    <span className={p.isVerified ? 'text-green-600' : 'text-gray-400'}>
                      {p.isVerified ? '✓ Verified' : 'Unverified'}
                    </span>
                    <Link href={`/admin-dashboard/passengers/${p.id}`}>
                      <Button size="sm" className="bg-gray-900 hover:bg-gray-700 text-white font-bold text-xs h-7 px-3 rounded-lg">
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