import { getOperatorBookings } from "@/src/services/dashboard-services/bookings";
import { AlertCircle } from "lucide-react";
import OperatorBookingsClient from "./OperatorsBookingsClient";

export default async function OperatorBookingsPage() {
  const result = await getOperatorBookings();

  if ("error" in result) {
    return (
      <section className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-500 text-lg mb-2">Failed to load bookings</p>
          <p className="text-gray-400 text-sm">{result.error}</p>
        </div>
      </section>
    );
  }

  const bookings = result.data?.data ?? [];

  return <OperatorBookingsClient bookings={bookings} />;
}