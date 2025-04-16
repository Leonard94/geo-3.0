import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import { Column, DataItem } from "../../../store/types";
import { Dots } from "../../../assets/icons/Dots";
import dayjs from "dayjs";
import styles from "./styles.module.scss";

const ACTION_COLUMN_WIDTH = 90;

interface IProps {
  columns: Column[];
  data?: DataItem[];
  onEditClick: (id: string) => void;
  onDeleteClick?: (id: string) => void;
}

export const DataTable: React.FC<IProps> = ({
  columns,
  data = [],
  onEditClick,
  onDeleteClick,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleEdit = () => {
    if (selectedId) {
      onEditClick(selectedId);
      handleMenuClose();
    }
  };

  const handleDelete = () => {
    if (selectedId && onDeleteClick) {
      onDeleteClick(selectedId);
      handleMenuClose();
    }
  };

  const formatCellValue = (column: Column, value: any) => {
    if (column.inputType === "datetime") {
      return dayjs(value).format("DD.MM.YYYY HH:mm");
    }

    if (column.inputType === "color") {
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 14,
              height: 14,
              borderRadius: 1,
              backgroundColor: value,
              border: "1px solid #e0e0e0",
            }}
          />
        </Box>
      );
    }

    if (column.format) {
      return column.format(value);
    }

    if (column.inputType === "toggle") {
      return value ? "Да" : "Нет";
    }

    return value;
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      className={styles.tableContainer}
    >
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align || "left"}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.label}
              </TableCell>
            ))}
            <TableCell align="center" style={{ width: ACTION_COLUMN_WIDTH }}>
              Действия
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              {columns.map((column) => (
                <TableCell
                  key={`${item.id}-${column.id}`}
                  align={column.align || "left"}
                  style={
                    column.id === "coordinates"
                      ? { whiteSpace: "pre-line" }
                      : undefined
                  }
                >
                  {formatCellValue(column, item[column.id])}
                </TableCell>
              ))}
              <TableCell align="center">
                <IconButton onClick={(e) => handleMenuOpen(e, item.id)}>
                  <Dots />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Редактировать</MenuItem>
        <MenuItem onClick={handleDelete}>Удалить</MenuItem>
      </Menu>
    </TableContainer>
  );
};
