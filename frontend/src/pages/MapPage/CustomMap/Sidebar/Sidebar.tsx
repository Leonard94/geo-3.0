import { useEffect } from "react";
import { IPoint } from "../types";
import { Switch } from "@mui/material";
import styles from "./styles.module.scss";

type TProps = {
  pointsList: IPoint[];

  isPointModeActive: boolean;
  isFilteredMode: boolean;
  handleOpenNewPointModal: () => void;
  onEdit: (point: IPoint) => void;
  setPoints: (points: IPoint[]) => void;
  setFilteredPoints: (filteredPoints: IPoint[]) => void;
  setIsFilteredMode: (newCondition: boolean) => void;
  onTogglePointMode: () => void;
  onPointsUpdate: (newPoints: IPoint[]) => void;
};

export const Sidebar: React.FC<TProps> = ({
  pointsList,
  isFilteredMode,
  setFilteredPoints,
  setIsFilteredMode,
}) => {
  const handleToggleFilter = () => {
    if (isFilteredMode) {
      setFilteredPoints([]);
      setIsFilteredMode(false);
      return;
    }
    setIsFilteredMode(true);
    const onlyValidPoints = pointsList.filter((item) => item.validity);
    setFilteredPoints(onlyValidPoints);
  };

  useEffect(() => {
    if (isFilteredMode) {
      const onlyValidPoints = pointsList.filter((item) => item.validity);
      setFilteredPoints(onlyValidPoints);
    }
  }, [pointsList]);

  return (
    <div className={styles.sidebar}>
      <div className={styles.switch_container}>
        <Switch
          checked={isFilteredMode}
          onChange={handleToggleFilter}
          color="primary"
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: "#4b5ce4",
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: "#4b5ce4",
            },
          }}
        />
        <span className={styles.label}>Только актуальные</span>
      </div>
    </div>
  );
};
