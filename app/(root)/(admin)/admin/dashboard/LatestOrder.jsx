import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LatestOrder = () => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">Order Id</TableHead>
            <TableHead>Payment Id</TableHead>
            <TableHead>Total Item</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 20 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>{`INV00${i + 1}`}</TableCell>
              <TableCell>{`PAY${i + 1}`}</TableCell>
              <TableCell>3</TableCell>
              <TableCell>Pending</TableCell>
              <TableCell>$100</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LatestOrder;
