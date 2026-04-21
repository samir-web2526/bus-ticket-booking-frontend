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

export interface SeatLock {
  id: string;
  seatId: string;
  scheduleId: string;
  userId: string;
  expiresAt: string;
  seat: Seat;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

async function getAccessToken(): Promise<string> {
  const cookieStore = cookies();
  return (await cookieStore).get('accessToken')?.value ?? '';
}

// ─── Services ─────────────────────────────────────────────────────────────────

/**
 * Lock multiple seats for a schedule
 * POST /api/v1/seat-locks
 */
export async function createSeatLock(
  seatIds: string[],
  scheduleId: string
): Promise<ServiceResponse<SeatLock[]>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/seat-locks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        seatIds,
        scheduleId,
      }),
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? 'Failed to lock seats' };
    }

    return { data: json?.data ?? [], error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    console.error('[createSeatLock]', message);
    return { data: null, error: message };
  }
}

/**
 * Release a single seat lock
 * DELETE /api/v1/seat-locks/:id
 */
export async function releaseSingleLock(
  lockId: string
): Promise<ServiceResponse<null>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/seat-locks/${lockId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? 'Failed to release lock' };
    }

    return { data: null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    console.error('[releaseSingleLock]', message);
    return { data: null, error: message };
  }
}

/**
 * Release all seat locks for a schedule by current user
 * DELETE /api/v1/seat-locks/all/:scheduleId
 */
export async function releaseAllLocks(
  scheduleId: string
): Promise<ServiceResponse<null>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/seat-locks/all/${scheduleId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? 'Failed to release locks' };
    }

    return { data: null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    console.error('[releaseAllLocks]', message);
    return { data: null, error: message };
  }
}