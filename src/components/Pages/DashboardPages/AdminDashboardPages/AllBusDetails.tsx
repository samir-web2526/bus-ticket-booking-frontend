import { getBusById } from "@/src/services/buses.service";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import BusDetailsClient from "./BusDetailsClient";

export default async function BusDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getBusById(id);

  if ("error" in result) {
    return (
      <section className="bg-[#07111f] min-h-screen py-24 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/operator-dashboard/buses"
            className="flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-rose-400 mx-auto mb-4" />
              <p className="text-rose-400 text-lg mb-2">Failed to load bus</p>
              <p className="text-slate-400 text-sm">{result.error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return <BusDetailsClient bus={result.data} />;
}