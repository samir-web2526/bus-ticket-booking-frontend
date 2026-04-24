// services/payment.service.ts
"use server";
import { cookies } from "next/headers";
import { ServiceResponse } from "./booking.service";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PaymentInitResult {
  checkoutUrl: string;
  sessionId: string;
}

export interface PaymentDetails {
  id: string;
  bookingId: string;
  stripeSessionId: string;
  amount: number;
  currency: string;
  status: "PAID" | "UNPAID";
  paidAt: string | null;
  createdAt: string;
  booking: {
    id: string;
    totalFare: number;
    status: string;
    user: { id: string; email: string; name: string };
    schedule: {
      bus: { name: string; operator: { name: string } };
      route: { sourceCity: string; destinationCity: string };
    };
    bookingSeats: { seat: { number: string; price: number } }[];
  };
}

export interface PaginatedPayments {
  data: PaymentDetails[];
  meta: { page: number; limit: number; total: number };
}

// ─── Helper ───────────────────────────────────────────────────────────────────

async function getAccessToken(): Promise<string> {
  const cookieStore = cookies();
  return (await cookieStore).get("accessToken")?.value ?? "";
}

// ─── Services ─────────────────────────────────────────────────────────────────

/**
 * Initialize Stripe Checkout Session for a booking
 * POST /api/v1/payments/init
 */
export async function createPayment(
  bookingId: string
): Promise<ServiceResponse<PaymentInitResult>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/payments/init`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ bookingId }),
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Failed to initialize payment" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[createPayment]", message);
    return { data: null, error: message };
  }
}

/**
 * Get payment details for a specific booking
 * GET /api/v1/payments/booking/:bookingId
 */
export async function getPaymentByBookingId(
  bookingId: string
): Promise<ServiceResponse<PaymentDetails>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/payments/booking/${bookingId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Failed to get payment details" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[getPaymentByBookingId]", message);
    return { data: null, error: message };
  }
}

/**
 * Get all payments — Admin only
 * GET /api/v1/payments
 */
export async function getAllPayments(params?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<ServiceResponse<PaginatedPayments>> {
  try {
    const accessToken = await getAccessToken();

    const query = new URLSearchParams(
      Object.entries(params ?? {})
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString();

    const result = await fetch(
      `${API}/api/v1/payments${query ? `?${query}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Failed to fetch payments" };
    }

    return { data: json ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[getAllPayments]", message);
    return { data: null, error: message };
  }
}