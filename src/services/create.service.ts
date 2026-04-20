import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function createSchedule(scheduleData){
    try{
        const cookieStore = cookies();
        const accessToken = (await cookieStore).get("accessToken")?.value;
        const result = await fetch(`${API}/api/v1/schedules`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(scheduleData)
        });
        return await result.json();
    } catch (error) {
        console.error("Error creating schedule:", error);
        throw error;
    }
}

export async function createRoute(routeData){
    try{
        const cookieStore = cookies();
        const accessToken = (await cookieStore).get("accessToken")?.value;
        const result = await fetch(`${API}/api/v1/routes`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(routeData)
        });
        return await result.json();
    } catch (error) {
        console.error("Error creating route:", error);
        throw error;
    }
}

export async function createBus(busData){
    try{
        const cookieStore = cookies();
        const accessToken = (await cookieStore).get("accessToken")?.value;
        const result = await fetch(`${API}/api/v1/buses`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(busData)
        });
        return await result.json();
    } catch (error) {
        console.error("Error creating bus:", error);
        throw error;
    }
}

export async function createBooking(bookingData){
    try{
        const cookieStore = cookies();
        const accessToken = (await cookieStore).get("accessToken")?.value;
        const result = await fetch(`${API}/api/v1/bookings`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(bookingData)
        });
        return await result.json();
    } catch (error) {
        console.error("Error creating booking:", error);
        throw error;
    }
}

export async function createOperator(operatorData){
    try{
        const result = await fetch(`${API}/api/v1/auth/register`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(operatorData)
        });
        return await result.json();
    } catch (error) {
        console.error("Error creating operator:", error);
        throw error;
    }
}

