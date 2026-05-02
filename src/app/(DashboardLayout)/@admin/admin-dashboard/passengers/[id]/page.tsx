import PassengerDetailPage from "@/src/components/Pages/DashboardPages/AdminDashboardPages/PassengerDetailsPage";

;


interface Props {
  params: Promise<{ id: string }>;
}

export default async function DetailsPage({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <PassengerDetailPage id={id} />
    </div>
  );
}