import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(name: string, calories: string) {
  return { name, calories };
}

const rows = [
  createData("Reads", "935.024"),
  createData("Bases", "20.3Gb"),
  createData("Coverage", "350x"),
  createData("N50", "39.151"),
];

export default function BasicTable() {
  return (
    <TableContainer component={Paper}>
      <Table
        sx={{ minWidth: 20 }}
        // padding="none"
        size="small"
        aria-label="a dense table"
      >
        {/*<TableHead>*/}
        {/*  <TableRow>*/}
        {/*    <TableCell>Dessert (100g serving)</TableCell>*/}
        {/*    <TableCell align="right">Calories</TableCell>*/}
        {/*  </TableRow>*/}
        {/*</TableHead>*/}
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="center" size="small">
                {row.calories}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
