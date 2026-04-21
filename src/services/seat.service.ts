"use server";
import { cookies } from 'next/headers';
import { ServiceResponse } from './booking.service';

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Seat {
  id: string;
  number: string;
  row: number;
  column: number;
  type: string; // 'STANDARD' | 'DELUXE' | 'VIP'
  price: number;
  busId: string;
  isAvailable: boolean;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

async function getAccessToken(): Promise<string> {
  const cookieStore = cookies();
  return (await cookieStore).get('accessToken')?.value ?? '';
}

// ─── Services ─────────────────────────────────────────────────────────────────

/**
 * Get all available seats for a schedule
 * GET /api/v1/seats/available/:scheduleId
 */
export async function getAvailableSeats(
  scheduleId: string
): Promise<ServiceResponse<Seat[]>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/seats/available/${scheduleId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? 'Failed to fetch seats' };
    }

    return { data: json?.data ?? [], error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    console.error('[getAvailableSeats]', message);
    return { data: null, error: message };
  }
}

// Export individual functions for use in server components
// Do NOT export as object in server context