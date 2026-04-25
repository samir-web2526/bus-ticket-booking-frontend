import RouteDetailsClient from "@/src/components/Pages/AllRoutesPage/RoutesDetailsClient";


interface Props {
  params: Promise<{ id: string }>;
}

export default async function RouteDetailsPage({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <RouteDetailsClient routeId={id} />
    </div>
  );
}