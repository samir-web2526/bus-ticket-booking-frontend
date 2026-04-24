"use server"
import { cookies } from 'next/headers';

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Booking {
  id: string;
  userId: string;
  scheduleId: string;
  totalFare: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
  bookingSeats: {
    seatId: string;
    seat: {
      id: string;
      number: string;
      type: string;
      price: number;
    };
  }[];
  schedule: {
    id: string;
    departure: string;
    arrival: string;
    bus: {
      id: string;
      name: string;
      type: string;
      number: string;
    };
    route: {
      sourceCity: string;
      destinationCity: string;
      distanceKm: number;
      estimatedTimeMinutes: number;
    };
  };
}

// Consistent response wrapper — used for ALL service functions
export type ServiceResponse<T> = 
  | { data: T; error: null }
  | { data: null; error: string };

// ─── Helper ───────────────────────────────────────────────────────────────────

async function getAccessToken(): Promise<string> {
  const cookieStore = cookies();
  return (await cookieStore).get('accessToken')?.value ?? '';
}

// ─── Services ─────────────────────────────────────────────────────────────────

// POST /api/v1/bookings
export async function createBooking(
  scheduleId: string
): Promise<ServiceResponse<Booking>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ scheduleId }),
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? 'Booking failed' };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    console.error('[createBooking]', message);
    return { data: null, error: message };
  }
}

// GET /api/v1/bookings/my-bookings
export async function getMyBookings(): Promise<ServiceResponse<Booking[]>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/bookings/my-bookings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? 'Failed to fetch bookings' };
    }

    return { data: json?.data ?? [], error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    console.error('[getMyBookings]', message);
    return { data: null, error: message };
  }
}

// GET /api/v1/bookings/:id
export async function getBookingById(
  bookingId: string
): Promise<ServiceResponse<Booking>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/bookings/${bookingId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? 'Booking not found' };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    console.error('[getBookingById]', message);
    return { data: null, error: message };
  }
}

// PATCH /api/v1/bookings/:id/cancel
export async function cancelBooking(
  bookingId: string
): Promise<ServiceResponse<null>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? 'Cancel failed' };
    }

    return { data: null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    console.error('[cancelBooking]', message);
    return { data: null, error: message };
  }
}