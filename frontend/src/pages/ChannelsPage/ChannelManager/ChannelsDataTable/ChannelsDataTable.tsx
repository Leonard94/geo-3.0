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
} from "@mui/material";
import { Dots } from "../../../../assets/icons";
import { IChannel } from "../../../../store/channels/channelsTypes";
import styles from "./styles.module.scss";

const ACTION_COLUMN_WIDTH = 90;

interface IProps {
  columns: {
    id: string;
    label: string;
    width?: number;
  }[];
  data: IChannel[];
  onEditClick: (id: string) => void;
  onDeleteClick?: (id: string) => void;
}

export const ChannelsDataTable: React.FC<IProps> = ({
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

  const formatCell = (column: { id: string }, value: any) => {
    if (column.id === "url") {
      return (
        <a href={value} target="_blank" rel="noopener noreferrer">
          {value}
        </a>
      );
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
          {data &&
            data.map((item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell key={`${item.id}-${column.id}`}>
                    {formatCell(column, item[column.id as keyof IChannel])}
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
