import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TableUsers() {
  return (
    <div className="flex justify-center w-full">
      <div className="flex justify-center w-[80%] mt-10">
        <Table>
          <TableHeader>
            <TableRow className="font-medium">
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Ativo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">1</TableCell>
              <TableCell>Victor</TableCell>
              <TableCell>Victor@gmail.com</TableCell>
              <TableCell>Sim</TableCell>
              <TableCell>Sim</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">1</TableCell>
              <TableCell>Victor</TableCell>
              <TableCell>Victor@gmail.com</TableCell>
              <TableCell>Sim</TableCell>
              <TableCell>Sim</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
