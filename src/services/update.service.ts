import { cookies } from "next/headers";
const API = process.env.NEXT_PUBLIC_BACKEND_URL;
export async function updateSchedule(scheduleId:string,scheduleData:Partial<Schedule>){
    try{
        const cookieStore = cookies();
        const accessToken = (await cookieStore).get("accessToken")?.value;
        const result = await fetch(`${API}/api/v1/schedules/${scheduleId}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(scheduleData)
        });
        return await result.json();
    } catch (error) {
        console.error("Error updating schedule:", error);
        throw error;

    }
}

export async function updateRoute(routeId:string,routeData:Partial<Route>){
    try{
        const cookieStore = cookies();
        const accessToken = (await cookieStore).get("accessToken")?.value;
        const result = await fetch(`${API}/api/v1/routes/${routeId}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(routeData)
        });
        return await result.json();
    } catch (error) {
        console.error("Error updating route:", error);
        throw error;
    }
}

export async function updateBus(busId:string,busData:Partial<Bus>){
    try{
        const cookieStore = cookies();
        const accessToken = (await cookieStore).get("accessToken")?.value;
        const result = await fetch(`${API}/api/v1/buses/${busId}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(busData)
        });
        return await result.json();
    } catch (error) {
        console.error("Error updating bus:", error);
        throw error;
    }
}

export async function updateBooking(bookingId:string,bookingData:Partial<Booking>){
    try{
        const cookieStore = cookies();
        const accessToken = (await cookieStore).get("accessToken")?.value;
        const result = await fetch(`${API}/api/v1/bookings/${bookingId}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(bookingData)
        });
        return await result.json();
    } catch (error) {
        console.error("Error updating booking:", error);
        throw error;
    }
}

