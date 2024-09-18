import Timetable from "@/components/TimeTable";
import { Bounded } from "@/components/common/Bounded";

// import Image from "next/image";
import {
  getPiers,
  getRoutes,
  getTimetableByRouteId,
  getPierNameById,
} from "@/lib/airtable";

export default async function Home() {
  const allPiers = await getPiers();
  const allRoutes = await getRoutes();

  const routeTimetables = await Promise.all(
    allRoutes.map(async (route) => {
      const timetables = await getTimetableByRouteId(route.id);

      const [fromPierName, toPierName] = getPierNameById(
        [route.fromPier[0], route.toPier[0]],
        allPiers,
      ) as string[];

      return {
        routeId: route.routeId, // Keep this as routeId for display purposes
        id: route.id, // Add this line to include the Airtable record ID
        fromPierName,
        toPierName,
        timetables: timetables || [],
      };
    }),
  );

  return (
    <Bounded>
      <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
        <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
          {/* {renderListItems(allPiers, (pier) => pier.pierName)} */}

          {routeTimetables.length > 0 ? ( // Added check for routeTimetables length
            routeTimetables.map(
              ({ routeId, fromPierName, toPierName, timetables }) => (
                <div key={routeId} className="mt-4">
                  <h3 className="font-bold">{`${fromPierName} - ${toPierName}`}</h3>
                  <Timetable timetables={timetables} />
                </div>
              ),
            )
          ) : (
            // Added fallback for empty routeTimetables
            <div>No routes available</div>
          )}
        </main>
      </div>{" "}
      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-6">
        {/* Footer content remains unchanged */}
      </footer>
    </Bounded>
  );
}
