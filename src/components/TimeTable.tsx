import {
  Table,
  TableRow,
  TableHead,
  TableHeader,
  TableCell,
  TableBody,
} from "./ui/table";

interface TimetableProps {
  timetables: { time: string; additionalRemarks: string }[];
}

const Timetable: React.FC<TimetableProps> = ({ timetables }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="border border-gray-300 p-2">Time</TableHead>
          <TableHead className="border border-gray-300 p-2">
            Additional Remarks
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {timetables.map((timetable, timetableIndex) => (
          <TableRow
            key={timetableIndex}
            className={
              timetableIndex % 2 === 0
                ? "bg-transparent text-white"
                : "bg-transparent text-white"
            }
          >
            <TableCell className="border border-gray-300 p-2">
              {timetable.time || "N/A"}
            </TableCell>
            <TableCell className="border border-gray-300 p-2">
              {timetable.additionalRemarks || "N/A"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Timetable;
