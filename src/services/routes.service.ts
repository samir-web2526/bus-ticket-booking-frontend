const API= process.env.NEXT_PUBLIC_BACKEND_URL;

export interface Route {
  id: string;
  sourceCity: string;
  destinationCity: string;
  distanceKm: number;
  estimatedTimeMinutes: number;
  stops?: string[];
  createdAt?: string;
  updatedAt?: string;
}
 
export interface RoutesResponse {
  data: Route[];
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  error?: string | null;
}
 
/**
 * Get all routes (for dropdowns)
 */
export async function getAllRoutes(): Promise<RoutesResponse> {
  try {
    const result = await fetch(`${API}/api/v1/routes`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
 
    const json = await result.json();
    console.log("[getAllRoutes]", json);
 
    if (!result.ok) {
      return {
        data: [],
        error: json.message ?? "Something went wrong",
      };
    }
 
    // ✅ Proper extraction
    let routes: Route[] = [];
 
    if (Array.isArray(json.data)) {
      routes = json.data;
    } else if (json.data?.data && Array.isArray(json.data.data)) {
      routes = json.data.data;
    }
 
    return {
      data: routes,
      meta: json.meta,
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[getAllRoutes]", message);
    return {
      data: [],
      error: message,
    };
  }
}