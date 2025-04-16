import { useState } from "react";
import { SwappableTable } from "./SwappableTable";
import styles from "./styles.module.scss";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";

export const SwappableList = () => {
  const [isShowSwappableList, setIsShowSwappableList] = useState(false);

  return (
    <div className={styles.swappeble}>
      {isShowSwappableList ? (
        <SwappableTable onClose={() => setIsShowSwappableList(false)} />
      ) : (
        <div className={styles.icon} onClick={() => setIsShowSwappableList(true)}>
          <FormatListNumberedIcon />
        </div>
      )}
    </div>
  );
};
