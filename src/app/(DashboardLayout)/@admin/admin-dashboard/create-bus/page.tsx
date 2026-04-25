
import CreateBus from "@/src/components/Pages/DashboardPages/AdminDashboardPages/CreateBus";
import { getAllUsers } from "@/src/services/dashboard-services/operators";

export const dynamic = 'force-dynamic';

export default async function CreateBusPage() {
  const res = await getAllUsers('OPERATOR');
  
  console.log('[CreateBusPage] operators res:', JSON.stringify(res)); // ✅ debug

  const operators = res?.data ?? [];

  return <CreateBus operators={operators} />;
}