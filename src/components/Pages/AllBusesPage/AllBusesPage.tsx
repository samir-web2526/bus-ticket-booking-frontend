import { getAllBuses } from "@/src/services/buses.service"


export default async function AllBusesPage() {
    const buses = await  getAllBuses();
    console.log(buses);
  return (
    <div>AllBusesPage:{buses.data?.data?.length ?? 0}</div>
  )
}
