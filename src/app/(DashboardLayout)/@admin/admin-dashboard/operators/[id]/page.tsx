
import OperatorDetailPage from "@/src/components/Pages/DashboardPages/AdminDashboardPages/OperatorDetailsPage";


interface Props {
  params: Promise<{ id: string }>;
}

export default async function DetailsPage({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <OperatorDetailPage id={id} />
    </div>
  );
}