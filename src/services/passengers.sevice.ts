"use server";

import { cookies } from "next/headers";
import { PaginatedResponse, ServiceResponse, User } from "./user.service";
const API = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface PassengerProfile {
  id: string
  userId: string
  gender: string | null
  dateOfBirth: string | null
  emergencyContact: string | null
}

export async function searchOperatorPassengers(
  searchTerm: string,
  page: number = 1,
  limit: number = 10
): Promise<ServiceResponse<PaginatedResponse<User>>> {
  return getOperatorPassengers({
    search: searchTerm,
    page,
    limit,
  });
}
/**
 * Get operator's passengers by status
 * GET /api/v1/users/operator/passengers?status=...
 */
export async function getOperatorPassengersByStatus(
  status: string,
  page: number = 1
): Promise<ServiceResponse<PaginatedResponse<User>>> {
  return getOperatorPassengers({
    status,
    page,
    limit: 10,
  });
}

async function getAccessToken(): Promise<string> {
  const cookieStore = cookies();
  return (await cookieStore).get("accessToken")?.value ?? "";
}

// export async function getOperatorPassengers(query?: {
//   page?: number;
//   limit?: number;
//   search?: string;
//   status?: string;
//   sortBy?: string;
//   sortOrder?: string;
// }): Promise<ServiceResponse<PaginatedResponse<User>>> {
//   try {
//     const accessToken = await getAccessToken();
 
//     if (!accessToken) {
//       return {
//         data: null,
//         error: 'Authentication required - no access token found',
//       };
//     }
 

//     const params = new URLSearchParams();
 
//     params.append('page', String(query?.page ?? 1));
//     params.append('limit', String(query?.limit ?? 10));
 
//     if (query?.search) params.append('search', query.search);
//     if (query?.status) params.append('status', query.status);
//     if (query?.sortBy) params.append('sortBy', query.sortBy);
//     if (query?.sortOrder) params.append('sortOrder', query.sortOrder);
 
//     // URL বানাও
//     const url = `${API}/api/v1/users/operator/passengers?${params.toString()}`;
 
//     // API call করো
//     const result = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
 
//     const json = await result.json();
 
//     // Error check
//     if (!result.ok) {
//       return {
//         data: null,
//         error: json?.message ?? 'Failed to fetch passengers',
//       };
//     }
 
//     // Success
//     return { data: json?.data ?? null, error: null };
//   } catch (err: unknown) {
//     const message = err instanceof Error ? err.message : 'Something went wrong';
//     console.error('[getOperatorPassengers]', message);
//     return { data: null, error: message };
//   }
// }

export async function getOperatorPassengers(query?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}): Promise<ServiceResponse<PaginatedResponse<User>>> {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        data: null,
        error: "Authentication required - no access token found",
      };
    }

    const params = new URLSearchParams();

    params.append("page", String(query?.page ?? 1));
    params.append("limit", String(query?.limit ?? 10));

    if (query?.search) params.append("search", query.search);
    if (query?.status) params.append("status", query.status);
    if (query?.sortBy) params.append("sortBy", query.sortBy);
    if (query?.sortOrder) params.append("sortOrder", query.sortOrder);

    const url = `${API}/api/v1/users/operator/passengers?${params.toString()}`;

    const result = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const json = await result.json();

    if (!result.ok) {
      return {
        data: null,
        error: json?.message ?? "Failed to fetch passengers",
      };
    }

    // ✅ FIXED HERE
    return {
      data: json, // 👈 full object (data + meta)
      error: null,
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Something went wrong";

    return {
      data: null,
      error: message,
    };
  }
}
 