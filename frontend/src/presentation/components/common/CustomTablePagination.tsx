import { TablePagination } from "@mui/material";
import React from "react";

interface CustomTablePaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowsPerPageOptions?: number[];
}

const CustomTablePagination: React.FC<CustomTablePaginationProps> = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25],
}) => {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={onPageChange}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={onRowsPerPageChange}
      rowsPerPageOptions={rowsPerPageOptions}
      labelRowsPerPage="Filas por página:"
      labelDisplayedRows={({ from, to, count }) =>
        `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
      }
      getItemAriaLabel={(type) => {
        if (type === "first") {
          return "Ir a la primera página";
        }
        if (type === "last") {
          return "Ir a la última página";
        }
        if (type === "next") {
          return "Ir a la página siguiente";
        }
        if (type === "previous") {
          return "Ir a la página anterior";
        }
        return "";
      }}
      sx={{
        "& .MuiTablePagination-selectLabel": {
          margin: 0,
        },
        "& .MuiTablePagination-displayedRows": {
          margin: 0,
        },
      }}
    />
  );
};

export default CustomTablePagination;
