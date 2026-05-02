import BusDetailsPage from "@/src/components/Pages/DashboardPages/OperatorDashboardPages/BusDetailsPage";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DetailPage({ params }: Props) {
  const { id } = await params;
  return <BusDetailsPage id={id} />;
}