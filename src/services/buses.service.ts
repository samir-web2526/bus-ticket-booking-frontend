"use server";

import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;
export async function getAllBuses(){
    try{
        const result = await fetch(`${API}/api/v1/buses`,{
            method:"GET",
            headers:{"Content-Type":"application/json"}
        })
        const json = await result.json();
        console.log(json);
        if(!result.ok) return {error:json.message ?? "Something went wrong"};
        return {data:json.data};
    }catch(err:unknown){
        const message = err instanceof Error ? err.message:"Something went wrong";
        console.error("[getAllBuses]",message);
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