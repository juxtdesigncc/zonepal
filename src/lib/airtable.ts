import { AirtableTs } from "airtable-ts";

import {
  piersTable,
  routesTable,
  timetableTable,
  Pier,
} from "../../apptMnvklTfJjWxc5";

const db = new AirtableTs({ apiKey: process.env.AIRTABLE_API_KEY });

export const piers = db.scan(piersTable);

export async function getPiers() {
  const allPiers = await piers;
  const filteredPiers = allPiers.filter(
    (record) => record.status === "Published",
  );
  return filteredPiers;
}

export function getPierNameById(
  ids: string | string[],
  allPiers: Pier[],
): string | string[] {
  const pierNames = Array.isArray(ids)
    ? ids.map((id) => {
        const pier = allPiers.find((pier) => pier.id === id);
        return pier?.pierName || "Unknown Pier"; // Fallback if pier is not found
      })
    : (() => {
        const pier = allPiers.find((pier) => pier.id === ids);
        return pier?.pierName || "Unknown Pier"; // Fallback if pier is not found
      })();

  return Array.isArray(ids) ? pierNames : pierNames[0]; // Return array if multiple IDs, else return single name
}

export async function getRoutes() {
  const allRoutes = await db.scan(routesTable);
  const filteredRoutes = allRoutes.filter(
    (record) => record.status === "Published",
  );
  return filteredRoutes; // Return only published routes
}
export async function getTimetableByRouteId(routeId: string) {
  const allTimetables = await db.scan(timetableTable);

  // Filter by checking if the routeId exists in the routeID array
  const timetableRecords = allTimetables.filter((record) =>
    record.routeID.includes(routeId),
  );

  // Ensure to return all records that match the routeId
  return timetableRecords.map((record) => ({
    time: record.time || "N/A", // Ensure to handle missing fields
    additionalRemarks: record.additionalRemarks || "N/A",
  }));
}
