// src/services/schedule.service.ts

const API= process.env.NEXT_PUBLIC_BACKEND_URL;

export interface SearchQuery {
  from?: string;
  to?: string;
  date?: string;
  busType?: string;
  page?: number;
  limit?: number;
}

export interface Schedule {
  id: string;
  bus: {
    id: string;
    name: string;
    type: string;
    number: string;
    totalSeats: number;
    pricePerSeat: number;
  };
  route: {
    sourceCity: string;
    destinationCity: string;
    distanceKm: number;
    estimatedTimeMinutes: number;
  };
  departure: string;
  arrival: string;
  availableSeats: number;
  price?: number;
  isActive: boolean;
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

export const searchSchedules = async (
  query: SearchQuery
): Promise<SearchResponse> => {
  try {
    const params = new URLSearchParams();

    if (query.from) params.append("sourceCity", query.from);
    if (query.to) params.append("destinationCity", query.to);
    if (query.date) params.append("date", query.date);
    if (query.busType) params.append("busType", query.busType);
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

    const schedules = json?.data?.data ?? [];

    console.log(
      "[searchSchedules] Extracted:",
      schedules.length,
      "schedules"
    );

    return {
      data: schedules,
      meta: json?.data?.meta,
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
 */
export const getAllSchedules = async (page = 1, limit = 12): Promise<SearchResponse> => {
  try {
    const url = `${API}/schedules?page=${page}&limit=${limit}`;

    console.log('[getAllSchedules] URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();

    if (!response.ok) {
      return {
        data: [],
        error: json.message || 'Failed to fetch schedules',
      };
    }

    let schedules: Schedule[] = [];

    if (Array.isArray(json.data.data)) {
      schedules = json.data.data;
    } else if (json.data?.data && Array.isArray(json.data.data)) {
      schedules = json.data.data;
    }

    return {
      data: schedules,
      meta: json.meta,
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error';
    console.error('[getAllSchedules] Error:', message);

    return {
      data: [],
      error: message,
    };
  }
};

/**
 * Get schedule by ID
 */
export const getScheduleById = async (id: string): Promise<{ data: Schedule | null; error: string | null }> => {
  try {
    const url = `${API}/schedules/${id}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: json.message || 'Failed to fetch schedule',
      };
    }

    // Extract schedule (could be direct or nested)
    const schedule = Array.isArray(json.data) ? json.data[0] : json.data;

    return {
      data: schedule || null,
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error';
    console.error('[getScheduleById] Error:', message);

    return {
      data: null,
      error: message,
    };
  }
};
