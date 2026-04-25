"use server";

import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OperatorProfile {
  userId: string;
  companyName: string;
  tradeLicense: string;
  nid: string;
  address: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  profileImage: string | null;
  role: "OPERATOR" | "PASSENGER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
}

export interface CreateOperatorPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  profileImage?: string;
  companyName: string;
  tradeLicense: string;
  nid: string;
  address: string;
}

export interface CreateOperatorResponse {
  user: Omit<User, "password">;
  operatorProfile: OperatorProfile;
}

// Consistent response wrapper — used for ALL service functions
export type ServiceResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string };

// ─── Helper ───────────────────────────────────────────────────────────────────

async function getAccessToken(): Promise<string> {
  const cookieStore = cookies();
  return (await cookieStore).get("accessToken")?.value ?? "";
}

// ─── Services ─────────────────────────────────────────────────────────────────

/**
 * Create a new operator (admin only)
 * POST /api/v1/users
 */
export async function createOperator(
  payload: CreateOperatorPayload
): Promise<ServiceResponse<CreateOperatorResponse>> {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        data: null,
        error: "Authentication required - no access token found",
      };
    }

    const result = await fetch(`${API}/api/v1/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await result.json();

    if (!result.ok) {
      return {
        data: null,
        error: json?.message ?? "Failed to create operator",
      };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[createOperator]", message);
    return { data: null, error: message };
  }
}

/**
 * Get all users with optional role filter
 * GET /api/v1/users?role=OPERATOR
 */
export async function getAllUsers(
  role?: string
): Promise<ServiceResponse<User[]>> {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        data: null,
        error: "Authentication required - no access token found",
      };
    }

    const url = role
      ? `${API}/api/v1/users?role=${role}`
      : `${API}/api/v1/users`;

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
        error: json?.message ?? "Failed to fetch users",
      };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[getAllUsers]", message);
    return { data: null, error: message };
  }
}

/**
 * Get all operators (convenience function)
 * GET /api/v1/users?role=OPERATOR
 */
export async function getAllOperators(): Promise<ServiceResponse<User[]>> {
  return getAllUsers("OPERATOR");
}

/**
 * Get user by ID
 * GET /api/v1/users/{id}
 */
export async function getUserById(
  userId: string
): Promise<ServiceResponse<User>> {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        data: null,
        error: "Authentication required - no access token found",
      };
    }

    const result = await fetch(`${API}/api/v1/users/${userId}`, {
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
        error: json?.message ?? "Failed to fetch user",
      };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[getUserById]", message);
    return { data: null, error: message };
  }
}

/**
 * Update user
 * PUT /api/v1/users/{id}
 */
export async function updateUser(
  userId: string,
  payload: Partial<CreateOperatorPayload>
): Promise<ServiceResponse<User>> {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        data: null,
        error: "Authentication required - no access token found",
      };
    }

    const result = await fetch(`${API}/api/v1/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await result.json();

    if (!result.ok) {
      return {
        data: null,
        error: json?.message ?? "Failed to update user",
      };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[updateUser]", message);
    return { data: null, error: message };
  }
}

/**
 * Delete user
 * DELETE /api/v1/users/{id}
 */
export async function deleteUser(
  userId: string
): Promise<ServiceResponse<{ id: string }>> {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        data: null,
        error: "Authentication required - no access token found",
      };
    }

    const result = await fetch(`${API}/api/v1/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const json = await result.json();

    if (!result.ok) {
      return {
        data: null,
        error: json?.message ?? "Failed to delete user",
      };
    }

    return { data: json?.data ?? null, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[deleteUser]", message);
    return { data: null, error: message };
  }
}