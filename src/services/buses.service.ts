/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface CreateBusPayload {
  name: string;
  number: string;
  type: string;
  totalSeats: number;
  vipSeats?: number;
  vipPrice?: number;
  deluxeSeats?: number;
  deluxePrice?: number;
  pricePerSeat: number;
  isActive?: boolean;
}

export type ServiceResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string };

// ─── Helper ────────────────────────────────────────────

async function getAccessToken(): Promise<string> {
  const cookieStore = cookies();
  return (await cookieStore).get("accessToken")?.value ?? "";
}

// ─── Service ───────────────────────────────────────────

// POST /api/v1/buses
export async function createBus(
  payload: CreateBusPayload
): Promise<ServiceResponse<any>> {
  try {
    const accessToken = await getAccessToken();

    const result = await fetch(`${API}/api/v1/buses`, {
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
        error: json?.message ?? "Failed to create bus",
      };
    }

    return {
      data: json?.data ?? null,
      error: null,
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Something went wrong";
    console.error("[createBus]", message);

    return {
      data: null,
      error: message,
    };
  }
}

export async function getAllBuses(params?: { limit?: number; page?: number; type?: string }) {
  try {
    const query = new URLSearchParams();
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.page) query.append('page', params.page.toString());
    if (params?.type) query.append('type', params.type);

    const url = `${API}/api/v1/buses${query.toString() ? `?${query.toString()}` : ''}`;

    const result = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await result.json();
    if (!result.ok) return { error: json.message ?? 'Something went wrong' };
    return { data: json.data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    console.error('[getAllBuses]', message);
    return { error: message };
  }
}

export async function getBusById(id:string){
    try{
        const result = await fetch(`${API}/api/v1/buses/${id}`,{
            method:"GET",
            headers:{"Content-Type":"application/json"}
        })
        const json = await result.json();
        console.log(json);
        if(!result.ok) return {error:json.message ?? "Something went wrong"};
        return {data:json.data};
    }catch(err:unknown){
        const message = err instanceof Error ? err.message:"Something went wrong";
        console.error("[getBusById]",message);
        return {error:message};
    }
}

export async function getOperatorBuses(){
    try{
        const cookieStore = cookies();
        const accessToken = (await cookieStore).get("accessToken")?.value;
        const result = await fetch(`${API}/api/v1/buses/my`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        });
        const json = await result.json();
        console.log(json);
        if(!result.ok) return {error:json.message ?? "Something went wrong"};
        return {data:json.data};
    }catch(err:unknown){
        const message = err instanceof Error ? err.message:"Something went wrong";
        console.error("[getOperatorBuses]",message);
        return {error:message};
    }
}