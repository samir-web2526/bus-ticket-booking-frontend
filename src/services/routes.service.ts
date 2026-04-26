// services/route.service.ts
"use server";

import { cookies } from "next/headers";
import { Schedule } from "./schedule.service";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Route {
  id: string;
  sourceCity: string;
  destinationCity: string;
  distanceKm: number;
  estimatedTimeMinutes: number;
  stops?: string[];
  createdAt?: string;
  updatedAt?: string;
  schedules: Schedule[];
}

export interface CreateRoutePayload {
  sourceCity: string;
  destinationCity: string;
  distanceKm: number;
  estimatedTimeMinutes: number;
  stops?: string[];
}

export type ServiceResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string };

export interface RoutesResponse {
  data: Route[];
  meta?: { page: number; limit: number; total: number };
  error: string | null;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

async function getAccessToken(): Promise<string> {
  const cookieStore = cookies();
  return (await cookieStore).get("accessToken")?.value ?? "";
}

// ─── Services ─────────────────────────────────────────────────────────────────

// POST /api/v1/routes — Admin/Operator only
export async function createRoute(
  payload: CreateRoutePayload
): Promise<ServiceResponse<Route>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/routes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Failed to create route" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[createRoute]", message);
    return { data: null, error: message };
  }
}

// GET /api/v1/routes — Public
export const getAllRoutes = async (params?: {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<RoutesResponse> => {
  try {
    const query = new URLSearchParams();

    if (params?.search) query.append("search", params.search);
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.sortBy) query.append("sortBy", params.sortBy);
    if (params?.sortOrder) query.append("sortOrder", params.sortOrder);

    const url = `${API}/api/v1/routes${query.toString() ? `?${query.toString()}` : ""}`;

    console.log("[getAllRoutes] URL:", url);

    const response = await fetch(url);

    const json = await response.json();

    if (!response.ok) {
      return {
        data: [],
        error: json.message || "Failed to fetch routes",
      };
    }

    const routes: Route[] = json?.data?.data ?? json?.data ?? [];

    console.log("[getAllRoutes] Extracted:", routes.length, "routes");

    return {
      data: routes,
      meta: json?.data?.meta || json?.meta,
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error";
    console.error("[getAllRoutes] Error:", message);
    return {
      data: [],
      error: message,
    };
  }
};

export const getRoutesForDropdown = async (): Promise<RoutesResponse> => {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(`${API}/api/v1/routes/dropdown`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      return {
        data: [],
        error: json?.message || "Failed to fetch routes",
      };
    }

    const routes: Route[] = json?.data ?? [];

    return {
      data: routes,
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error";
    console.error("[getRoutesForDropdown] Error:", message);
    return { data: [], error: message };
  }
};

// GET /api/v1/routes/:id — Public
export async function getRouteById(
  id: string
): Promise<ServiceResponse<Route>> {
  try {
    const result = await fetch(`${API}/api/v1/routes/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const json = await result.json();
    console.log("API RAW:", json);

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Route not found" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[getRouteById]", message);
    return { data: null, error: message };
  }
}

// PATCH /api/v1/routes/:id — Admin only
export async function updateRoute(
  id: string,
  payload: Partial<CreateRoutePayload>
): Promise<ServiceResponse<Route>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/routes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Failed to update route" };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[updateRoute]", message);
    return { data: null, error: message };
  }
}

// DELETE /api/v1/routes/:id — Admin only
export async function deleteRoute(
  id: string
): Promise<ServiceResponse<null>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/routes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const json = await result.json();

    if (!result.ok) {
      return { data: null, error: json?.message ?? "Failed to delete route" };
    }

    return { data: null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[deleteRoute]", message);
    return { data: null, error: message };
  }
}