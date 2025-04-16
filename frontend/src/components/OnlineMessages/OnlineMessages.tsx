import styles from "./styles.module.scss";
import TelegramIcon from "@mui/icons-material/Telegram";

export const OnlineMessages = () => {
  return (
    <div className={styles.messages}>
      <div className={styles.icon}>
        <TelegramIcon />
      </div>
    </div>
  );
};
