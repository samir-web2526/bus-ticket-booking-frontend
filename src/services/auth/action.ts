"use server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";
const API = process.env.NEXT_PUBLIC_BACKEND_URL;
export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "OPERATOR" | "PASSENGER";
}

const getToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value ?? null;
};

export async function getUser(): Promise<User | null> {
  try {
    const token = await getToken();
    if (!token) return null;
    const user = jwtDecode<User>(token);
    return user;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[getUser]", message);
    return null;
  }
}

export async function signIn(data: { email: string; password: string }) {
  try {
    const res = await fetch(`${API}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { error: json.message ?? "Something went wrong" };
    const { accessToken, refreshToken } = json.data;
     const { role } = jwtDecode<{ role: string }>(accessToken);
    const cookieStore = await cookies();
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 15,
    });
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return { success: true, role };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[signIn]", message);
    return { error: message };
  }
}

export async function signUp(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  try {
    const res = await fetch(`${API}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { error: json.message ?? "Something went wrong" };
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[signUp]", message);
    return { error: message };
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("[logout]", message);
  } finally {
    redirect("/login");
  }
}