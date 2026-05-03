import BusDetailsClient from "@/src/components/Pages/DashboardPages/AdminDashboardPages/BusDetailsClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DetailsPage({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <BusDetailsClient id={id} />
    </div>
  );
}