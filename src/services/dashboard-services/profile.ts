const API = process.env.NEXT_PUBLIC_BACKEND_URL

// export async function getProfile(accessToken?:string){
//     console.log("ACCESS TOKEN:", accessToken);
//     try{
//         const result = await fetch(`${API}/api/v1/users/me`,{
//             method:"GET",
//             credentials:"include",
//             headers:{
//                 "Content-Type":"application/json",
//                 "Authorization":`Bearer ${accessToken}`
//             }
//         })
//         const json = await result.json();
//         if(!result.ok) return {error:json.message ?? "Something went wrong"};
//         return {data:json.data};

//     }catch(err:unknown){
//         const message = err instanceof Error ? err.message:"Something went wrong";
//         console.error("[getProfile]",message);
//         return {error:message};
//     }
// }


// export async function getProfile(){
//     try{
//         const result = await fetch(`${API}/api/v1/users/me`,{
//             method:"GET",
//             credentials:"include"
//         })

//         const json = await result.json();

//         if(!result.ok)
//             return {error:json.message ?? "Something went wrong"};

//         return {data:json.data};

//     }catch(err:unknown){
//         const message =
//             err instanceof Error
//             ? err.message
//             : "Something went wrong";

//         console.error("[getProfile]",message);

//         return {error:message};
//     }
// }

import { cookies } from "next/headers";


export async function getProfile(){
    try{

        const cookieStore = cookies();

        const accessToken =
            (await cookieStore).get("accessToken")?.value;

        console.log("SERVER TOKEN:", accessToken);

        const result = await fetch(
            `${API}/api/v1/users/me`,
            {
                method:"GET",
                headers:{
                    Authorization:`Bearer ${accessToken}`
                },
                cache:"no-store"
            }
        );

        const json = await result.json();

        if(!result.ok)
            return {error:json.message ?? "Something went wrong"};

        return {data:json.data};

    }catch(err:unknown){

        const message =
            err instanceof Error
            ? err.message
            : "Something went wrong";

        console.error("[getProfile]",message);

        return {error:message};
    }
}