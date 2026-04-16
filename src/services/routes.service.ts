const API= process.env.NEXT_PUBLIC_BACKEND_URL;
export async function getAllRoutes(){
    try{
        const result = await fetch(`${API}/api/v1/routes`,{
        method:"GET",
        headers:{"Content-Type":"application/json"}
    })
    const json = await result.json();
    console.log(json);
    if(!result.ok) return {error:json.message ?? "Something went wrong"};
    return {data:json.data};
    }catch(err:unknown){
        const message = err instanceof Error ? err.message:"Something went wrong";
        console.error("[getAllRoutes]",message);
        return {error:message};
    }
}