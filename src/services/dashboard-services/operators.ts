import { cookies } from "next/headers";
const API = process.env.NEXT_PUBLIC_BACKEND_URL;
export async function getAllUsers(role?:string){
    try{
        const cookieStore = cookies();
        const accessToken = (await cookieStore).get("accessToken")?.value;
        const url = role ? `${API}/api/v1/users?role=${role}` : `${API}/api/v1/users`;

        const result = await fetch(url,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                 Authorization:`Bearer ${accessToken}`
            }
        });
        const json = await result.json();
        if(!result.ok) return {error:json.message ?? "Something went wrong"};
        return {data:json.data};
    }
    catch(err:unknown){
        const message = err instanceof Error ? err.message : "Something went wrong";
        console.error("[getAllUsers]",message);
        return {error:message};
    }
}