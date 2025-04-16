import React, { useState, useEffect } from "react";
import {
  MainPointDefinition,
  ExtendedMainPointDefinition,
  RayDefinition,
} from "../../../../../store/rab/rabTypes";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  Grid,
  Paper,
  FormControlLabel,
  Switch,
  Tooltip,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";

const ensureHexColor = (color: string | undefined): string => {
  if (!color) {
    return "#FF0000";
  }

  if (color.startsWith("rgb")) {
    const matches = color.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/
    );
    if (matches) {
      const r = parseInt(matches[1]);
      const g = parseInt(matches[2]);
      const b = parseInt(matches[3]);
      return `#${r.toString(16).padStart(2, "0")}${g
        .toString(16)
        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    }
  }

  return color;
};

interface IProps {
  isOpen: boolean;
  point: MainPointDefinition;
  onClose: () => void;
  onUpdate: (updatedPoint: ExtendedMainPointDefinition) => void;
}

export const RayConfigDrawer: React.FC<IProps> = ({
  isOpen,
  point,
  onClose,
  onUpdate,
}) => {
  const initialExtendedPoint: ExtendedMainPointDefinition = {
    ...point,
    active: point.active !== false,
    pointColor: point.pointColor || "#000000",
    rayDefinitions: point.rayDefinitions.map((ray) => ({
      ...ray,
      visible: ray.visible !== false,
    })),
  };

  const [localPoint, setLocalPoint] =
    useState<ExtendedMainPointDefinition>(initialExtendedPoint);

  useEffect(() => {
    const newExtendedPoint: ExtendedMainPointDefinition = {
      ...point,
      active: point.active !== false,
      pointColor: point.pointColor || "#000000",
      rayDefinitions: point.rayDefinitions.map((ray) => ({
        ...ray,
        visible: ray.visible !== false,
      })),
    };
    setLocalPoint(newExtendedPoint);
  }, [point]);

  const handleCoordinateChange = (
    type: "latitude" | "longitude",
    value: string
  ) => {
    const newCoordinates: [number, number] = [...localPoint.coordinates];
    const index = type === "latitude" ? 0 : 1;
    newCoordinates[index] = parseFloat(value) || 0;

    setLocalPoint((prev) => ({
      ...prev,
      coordinates: newCoordinates,
    }));
  };

  const handleRayDefinitionChange = (
    rayIndex: number,
    field: keyof RayDefinition,
    value: string | boolean
  ) => {
    const newRayDefinitions = [...localPoint.rayDefinitions];

    if (
      typeof value === "string" &&
      (field === "distance" || field === "azimuth" || field === "openingAngle")
    ) {
      newRayDefinitions[rayIndex] = {
        ...newRayDefinitions[rayIndex],
        [field]: parseFloat(value) || 0,
      };
    } else {
      newRayDefinitions[rayIndex] = {
        ...newRayDefinitions[rayIndex],
        [field]: value,
      };
    }

    setLocalPoint((prev) => ({
      ...prev,
      rayDefinitions: newRayDefinitions,
    }));
  };

  const handleRayVisibilityToggle = (rayIndex: number) => {
    const newRayDefinitions = [...localPoint.rayDefinitions];
    newRayDefinitions[rayIndex] = {
      ...newRayDefinitions[rayIndex],
      visible: !newRayDefinitions[rayIndex].visible,
    };

    setLocalPoint((prev) => ({
      ...prev,
      rayDefinitions: newRayDefinitions,
    }));
  };

  const handleAddRay = () => {
    const newRay: RayDefinition = {
      name: `Луч ${localPoint.rayDefinitions.length + 1}`,
      distance: 5000,
      azimuth: 0,
      openingAngle: 45,
      visible: true,
      color: localPoint.color || "#FF0000",
    };

    setLocalPoint((prev) => ({
      ...prev,
      rayDefinitions: [...prev.rayDefinitions, newRay],
    }));
  };

  const handleDeleteRay = (rayIndex: number) => {
    if (localPoint.rayDefinitions.length <= 1) {
      setLocalPoint((prev) => ({
        ...prev,
        rayDefinitions: [],
      }));
    } else {
      const newRayDefinitions = localPoint.rayDefinitions.filter(
        (_, index) => index !== rayIndex
      );

      setLocalPoint((prev) => ({
        ...prev,
        rayDefinitions: newRayDefinitions,
      }));
    }
  };

  const handleActiveStatusChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLocalPoint((prev) => ({
      ...prev,
      active: event.target.checked,
    }));
  };

  const handleSave = () => {
    onUpdate(localPoint);
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: "100%", sm: 400 } },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="h6">Настройки</Typography>
          <IconButton onClick={onClose} edge="end">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={localPoint.active}
                onChange={handleActiveStatusChange}
                color="primary"
              />
            }
            label="Активен"
          />
        </Box>

        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Координаты главной точки
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Широта (lat)"
              type="number"
              size="small"
              value={localPoint.coordinates[0]}
              onChange={(e) =>
                handleCoordinateChange("latitude", e.target.value)
              }
              inputProps={{ step: "0.000001" }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Долгота (lon)"
              type="number"
              size="small"
              value={localPoint.coordinates[1]}
              onChange={(e) =>
                handleCoordinateChange("longitude", e.target.value)
              }
              inputProps={{ step: "0.000001" }}
            />
          </Grid>
        </Grid>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Высота над уровнем моря (м)
        </Typography>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Высота над уровнем моря"
            type="number"
            size="small"
            value={localPoint.altitude || "0"}
            onChange={(e) => {
              setLocalPoint((prev) => ({
                ...prev,
                altitude: e.target.value,
              }));
            }}
            inputProps={{ step: "1" }}
          />
        </Grid>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            mt: 3,
          }}
        >
          <Typography variant="subtitle1">Лучи</Typography>
          <Tooltip title="Добавить новый луч">
            <IconButton color="primary" onClick={handleAddRay} size="small">
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {localPoint.rayDefinitions.map((ray, index) => (
          <Paper
            key={index}
            elevation={1}
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: ray.visible ? "#f8f8f8" : "#e0e0e0",
              position: "relative",
              opacity: ray.visible ? 1 : 0.7,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <TextField
                fullWidth
                label="Название луча"
                size="small"
                value={ray.name || `Луч ${index + 1}`}
                onChange={(e) =>
                  handleRayDefinitionChange(index, "name", e.target.value)
                }
                disabled={!ray.visible}
                sx={{ flexGrow: 1, mr: 1 }}
              />
              <Box>
                <Tooltip title={ray.visible ? "Скрыть луч" : "Показать луч"}>
                  <IconButton
                    size="small"
                    onClick={() => handleRayVisibilityToggle(index)}
                  >
                    {ray.visible ? (
                      <VisibilityIcon fontSize="small" />
                    ) : (
                      <VisibilityOffIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Удалить луч">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteRay(index)}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Дистанция (м)"
                  type="number"
                  size="small"
                  value={ray.distance}
                  onChange={(e) =>
                    handleRayDefinitionChange(index, "distance", e.target.value)
                  }
                  disabled={!ray.visible}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="color"
                  size="small"
                  label="Цвет луча"
                  value={ensureHexColor(
                    ray.color || localPoint.color || "#FF0000"
                  )}
                  onChange={(e) =>
                    handleRayDefinitionChange(index, "color", e.target.value)
                  }
                  InputProps={{
                    sx: { height: 40 },
                  }}
                  disabled={!ray.visible}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Азимут (°)"
                  type="number"
                  size="small"
                  value={ray.azimuth}
                  onChange={(e) =>
                    handleRayDefinitionChange(index, "azimuth", e.target.value)
                  }
                  inputProps={{ min: 0, max: 360 }}
                  disabled={!ray.visible}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Угол раскрытия (°)"
                  type="number"
                  size="small"
                  value={ray.openingAngle}
                  onChange={(e) =>
                    handleRayDefinitionChange(
                      index,
                      "openingAngle",
                      e.target.value
                    )
                  }
                  inputProps={{ min: 0, max: 180 }}
                  disabled={!ray.visible}
                />
              </Grid>
            </Grid>
          </Paper>
        ))}

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 3,
          }}
        >
          <Button variant="outlined" onClick={onClose}>
            Закрыть
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Сохранить
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};
