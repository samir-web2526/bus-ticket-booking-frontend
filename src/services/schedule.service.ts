// src/services/schedule.service.ts

import { ServiceResponse } from './booking.service';

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SearchQuery {
  from?: string;
  to?: string;
  date?: string;
  busType?: string;
  page?: number;
  search?: string;
  limit?: number;
}

// export interface Schedule {
//   id: string;
//   busId: string;
//   routeId: string;

//   departure: string;
//   arrival: string;
//   status: string;

//   bus: {
//     id: string;
//     operatorId: string;
//     name: string;
//     number: string;
//     type: string;
//     totalSeats: number;
//     pricePerSeat: number;
//     isDeleted: boolean;
//     isActive: boolean;
//     createdAt: string;
//     updatedAt: string;
//   };

//   route: {
//     id: string;
//     sourceCity: string;
//     destinationCity: string;
//     distanceKm: number;
//     estimatedTimeMinutes: number;
//     stops: string[];
//     createdAt: string;
//     updatedAt: string;
//   };
// }

// export interface Schedule {
//   id: string;
//   bus: {
//     id: string;
//     name: string;
//     type: string;
//     number: string;
//     totalSeats: number;
//     pricePerSeat: number;
//   };
//   route: {
//     sourceCity: string;
//     destinationCity: string;
//     distanceKm: number;
//     estimatedTimeMinutes: number;
//   };
//   departure: string;
//   arrival: string;
//   availableSeats: number;
//   price?: number;
//   isActive: boolean;
// }

export interface Schedule {
  id: string;
  busId: string;
  routeId: string;

  departure: string;
  arrival: string;
  status: string;

  bus: {
    id: string;
    operatorId: string;

    name: string;
    number: string;
    type: string;
    totalSeats: number;
    pricePerSeat: number;

    isDeleted: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;

    // ✅ IMPORTANT: now available from backend
    operator: {
      id: string;
      name: string;
      email: string;
      phone: string;
      profileImage?: string;
    };
  };

  route: {
    id: string;
    sourceCity: string;
    destinationCity: string;
    distanceKm: number;
    estimatedTimeMinutes: number;
    stops: string[];
    createdAt: string;
    updatedAt: string;
  };
}

export interface SearchResponse {
  data: Schedule[];
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  error?: string | null;
}

// ─── Services ─────────────────────────────────────────────────────────────────

/**
 * Search schedules with filters
 * GET /api/v1/schedules?sourceCity=...&destinationCity=...&date=...
 */
export const searchSchedules = async (
  query: SearchQuery
): Promise<SearchResponse> => {
  try {
    const params = new URLSearchParams();

    if (query.from) params.append("sourceCity", query.from);
    if (query.to) params.append("destinationCity", query.to);
    if (query.date) params.append("date", query.date);
    if (query.busType) params.append("busType", query.busType);
    if (query.search) params.append("search", query.search);
    if (query.page) params.append("page", query.page.toString());
    if (query.limit) params.append("limit", query.limit.toString());

    const url = `${API}/api/v1/schedules?${params.toString()}`;

    console.log("[searchSchedules] URL:", url);

    const response = await fetch(url);

    const json = await response.json();

    console.log("[searchSchedules] Raw Response:", json);

    if (!response.ok) {
      return {
        data: [],
        error: json.message || "Search failed",
      };
    }

    const schedules = json?.data?.data ?? json?.data ?? [];

    console.log(
      "[searchSchedules] Extracted:",
      schedules.length,
      "schedules"
    );

    return {
      data: schedules,
      meta: json?.data?.meta || json?.meta,
      error: null,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Network error";

    console.error("[searchSchedules] Error:", message);

    return {
      data: [],
      error: message,
    };
  }
};

/**
 * Get all schedules without filters
 * GET /api/v1/schedules?page=...&limit=...
 */
export const getAllSchedules = async (
  page = 1,
  limit = 12
): Promise<SearchResponse> => {
  try {
    const url = `${API}/api/v1/schedules?page=${page}&limit=${limit}`;

    console.log("[getAllSchedules] URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    if (!response.ok) {
      return {
        data: [],
        error: json.message || "Failed to fetch schedules",
      };
    }

    const schedules = json?.data?.data ?? json?.data ?? [];

    return {
      data: schedules,
      meta: json?.data?.meta || json?.meta,
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network error";
    console.error("[getAllSchedules] Error:", message);

    return {
      data: [],
      error: message,
    };
  }
};

/**
 * Get schedule by ID
 * GET /api/v1/schedules/:id
 */
export const getScheduleById = async (
  id: string
): Promise<ServiceResponse<Schedule>> => {
  try {
    // ✅ Fixed: Use /api/v1/schedules/:id
    const url = `${API}/api/v1/schedules/${id}`;

    console.log("[getScheduleById] URL:", url);
    console.log("[getScheduleById] Schedule ID:", id);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    console.log("[getScheduleById] Raw Response:", {
      status: response.status,
      ok: response.ok,
      data: json,
    });

    if (!response.ok) {
      return {
        data: null,
        error: json?.message || `Failed to fetch schedule (${response.status})`,
      };
    }

    // Extract schedule (could be direct or nested)
    const schedule = Array.isArray(json.data) ? json.data[0] : json.data;

    if (!schedule) {
      return {
        data: null,
        error: "Schedule data is empty",
      };
    }

    return {
      data: schedule,
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network error";
    console.error("[getScheduleById] Error:", message);

    return {
      data: null,
      error: message,
    };
  }
};