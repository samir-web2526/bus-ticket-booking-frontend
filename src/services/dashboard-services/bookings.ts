import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;
export async function getAllBookings(){
    try {
        const cookieStore = cookies();
        const accessToken = (await cookieStore).get("accessToken")?.value;
        const result = await fetch(`${API}/api/v1/bookings/all`,{
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
        console.error("[getAllBookings]",message);
        return {error:message};
    }
}

export async function getMyBookings(){
    try{
        const cookieStore = cookies();
        const accessToken = (await cookieStore).get("accessToken")?.value;
        const result = await fetch(`${API}/api/v1/bookings`,{
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
        console.error("[getMyBookings]",message);
        return {error:message};
    }
}

export async function getOperatorBookings(){
    try{
        const cookieStore = cookies();
        const accessToken = (await cookieStore).get("accessToken")?.value;
        const result = await fetch(`${API}/api/v1/bookings/operator`,{
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
        console.error("[getOperatorBookings]",message);
        return {error:message};
    }
}