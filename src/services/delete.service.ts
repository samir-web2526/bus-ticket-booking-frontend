import { cookies } from "next/headers";
const API = process.env.NEXT_PUBLIC_BACKEND_URL;
export async function deleteSchedule(scheduleId:string){
    try{
        const cookieStore = cookies();
        const accessToken = (await cookieStore).get("accessToken")?.value;
        const result = await fetch(`${API}/api/v1/schedules/${scheduleId}`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        });
        return await result.json();
    } catch (error) {
        console.error("Error deleting schedule:", error);
        throw error;
    }
}

export async function deleteRoute(routeId:string){
    try{
        const cookieStore = cookies();
        const accessToken = (await cookieStore).get("accessToken")?.value;
        const result = await fetch(`${API}/api/v1/routes/${routeId}`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        });
        return await result.json();
    } catch (error) {
        console.error("Error deleting route:", error);
        throw error;
    }
}

export async function deleteBus(busId:string){
    try{
        const cookieStore = cookies();
        const accessToken = (await cookieStore).get("accessToken")?.value;
        const result = await fetch(`${API}/api/v1/buses/${busId}`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        });
        return await result.json();
    } catch (error) {
        console.error("Error deleting bus:", error);
        throw error;

    }
}