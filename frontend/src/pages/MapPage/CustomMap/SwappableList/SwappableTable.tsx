import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
} from "@mui/material";
import { useAppSelector } from "../../../../store/hooks";
import { useActiveIncidentsStore } from "../../../../zustandStore/useActiveIncidentsStore";
import CloseIcon from "@mui/icons-material/Close";

const COLUMN_WIDTHS = {
  incident: 150,
  object: 200,
  responsible: 200,
  phone: 120,
};

const commonCellStyles = (width: number) => ({
  fontSize: "12px",
  width: width,
  maxWidth: width,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

interface IProps {
  onClose: () => void;
}

export const SwappableTable: React.FC<IProps> = ({ onClose }) => {
  const {
    objects: { items: objects },
    employees: { items: employees },
    incidents: { items: incidents },
  } = useAppSelector((state) => state);

  const { activeIncidents } = useActiveIncidentsStore((s) => s);

  const getIncidentDetails = (incidentId: string) => {
    const objectIds = activeIncidents[incidentId] || [];

    const affectedObjects = objectIds
      .map((objectId) => {
        const object = objects.find((obj) => obj.id === objectId);

        if (!object || object?.isExternalObject === "true") {
          return null;
        }

        const responsible = employees.find(
          (emp) => String(emp.linkedObject) === objectId
        );

        return {
          objectId,
          objectName: object?.name || "Неизвестный объект",
          employeeName: responsible?.fullName || "-",
          phone: responsible?.phone || "-",
        };
      })
      .filter(
        (
          obj
        ): obj is {
          objectId: string;
          objectName: string;
          employeeName: string;
          phone: string;
        } => obj !== null
      );

    return {
      affectedObjects,
      hasActiveObjects: objectIds.length > 0,
    };
  };

  const start = performance.now();

  useEffect(() => {
    const end = performance.now();
    console.log(`⏱ Время рендера: ${end - start} мс`);
  });

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: "80%",
        minWidth: 600,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Сводка</Typography>
        <div onClick={onClose}>
          <CloseIcon />
        </div>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 200 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              <TableCell
                sx={{
                  ...commonCellStyles(COLUMN_WIDTHS.incident),
                  fontWeight: "bold",
                  backgroundColor: "#fff",
                }}
              >
                Инцидент
              </TableCell>
              <TableCell
                sx={{
                  ...commonCellStyles(COLUMN_WIDTHS.object),
                  fontWeight: "bold",
                }}
              >
                Объект
              </TableCell>
              <TableCell
                sx={{
                  ...commonCellStyles(COLUMN_WIDTHS.responsible),
                  fontWeight: "bold",
                }}
              >
                Ответственный
              </TableCell>
              <TableCell
                sx={{
                  ...commonCellStyles(COLUMN_WIDTHS.phone),
                  fontWeight: "bold",
                }}
              >
                Телефон
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incidents.map((incident) => {
              const { affectedObjects, hasActiveObjects } = getIncidentDetails(
                incident.id
              );

              if (affectedObjects.length === 0) {
                return (
                  <TableRow key={incident.id}>
                    <Tooltip title={incident.title} placement="top" arrow>
                      <TableCell sx={commonCellStyles(COLUMN_WIDTHS.incident)}>
                        {incident.title}
                      </TableCell>
                    </Tooltip>
                    <Tooltip
                      title="нет объектов в зоне поражения"
                      placement="top"
                      arrow
                    >
                      <TableCell sx={commonCellStyles(COLUMN_WIDTHS.object)}>
                        нет объектов в зоне поражения
                      </TableCell>
                    </Tooltip>
                    <Tooltip title="-" placement="top" arrow>
                      <TableCell
                        sx={commonCellStyles(COLUMN_WIDTHS.responsible)}
                      >
                        -
                      </TableCell>
                    </Tooltip>
                    <Tooltip title="-" placement="top" arrow>
                      <TableCell sx={commonCellStyles(COLUMN_WIDTHS.phone)}>
                        -
                      </TableCell>
                    </Tooltip>
                  </TableRow>
                );
              }

              return affectedObjects.map((obj, index) => (
                <TableRow
                  key={`${incident.id}-${obj.objectId}`}
                  sx={{
                    backgroundColor: hasActiveObjects ? "#ffcccc" : "inherit",
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <Tooltip
                    title={index === 0 ? incident.title : ""}
                    placement="top"
                    arrow
                  >
                    <TableCell sx={commonCellStyles(COLUMN_WIDTHS.incident)}>
                      {index === 0 ? incident.title : ""}
                    </TableCell>
                  </Tooltip>
                  <Tooltip title={obj.objectName} placement="top" arrow>
                    <TableCell sx={commonCellStyles(COLUMN_WIDTHS.object)}>
                      {obj.objectName}
                    </TableCell>
                  </Tooltip>
                  <Tooltip title={obj.employeeName} placement="top" arrow>
                    <TableCell sx={commonCellStyles(COLUMN_WIDTHS.responsible)}>
                      {obj.employeeName}
                    </TableCell>
                  </Tooltip>
                  <Tooltip title={obj.phone} placement="top" arrow>
                    <TableCell sx={commonCellStyles(COLUMN_WIDTHS.phone)}>
                      {obj.phone}
                    </TableCell>
                  </Tooltip>
                </TableRow>
              ));
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
