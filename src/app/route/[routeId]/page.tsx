import Timetable from "@/components/TimeTable";
import { Bounded } from "@/components/common/Bounded";

import {
  getRoutes,
  getPiers,
  getTimetableByRouteId,
  getPierNameById,
} from "../../../lib/airtable";

interface RoutePageProps {
  params: {
    routeId: string;
  };
}

const RoutePage = async ({ params }: RoutePageProps) => {
  // Fetch page information
  const { routeId } = params;
  const allRoutes = await getRoutes();
  const route = allRoutes.find((r) => r.routeId === routeId);

  // Fetch Pier related information and timetables
  const allPiers = await getPiers();
  const timetables = route ? await getTimetableByRouteId(route.id) : [];

  // Get pier names using fromPier and toPier IDs
  const fromPierName = route
    ? getPierNameById(route.fromPier, allPiers)
    : "Unknown Pier";
  const toPierName = route
    ? getPierNameById(route.toPier, allPiers)
    : "Unknown Pier";

  return (
    <Bounded>
      <h2 className="mb-4 text-2xl font-bold">{`${fromPierName} to ${toPierName}`}</h2>
      <h3 className="mb-2 text-lg">Route Information:</h3>
      <p>{`Route ID: ${route?.routeId}`}</p>

      <h3 className="mb-2 mt-4 text-lg">Timetable:</h3>
      <Timetable timetables={timetables} />
    </Bounded>
  );
};

export default RoutePage;
