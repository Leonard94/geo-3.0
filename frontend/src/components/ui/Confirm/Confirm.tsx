import styles from "./styles.module.scss";

interface IProps {
  title: string;
  subtitle: string;
  btnConfirm: string;
  btnCancel: string;
  confirm: () => void;
  cancel: () => void;
}

export const Confirm: React.FC<IProps> = ({
  title,
  subtitle,
  btnConfirm,
  btnCancel,
  confirm,
  cancel,
}) => {
  return (
    <div className={styles.confirm}>
      <div className={styles.title}>{title}</div>
      <div className={styles.subtitle}>{subtitle}</div>
      <div className={styles.row}>
        <button className={styles.btn} onClick={cancel}>{btnCancel}</button>
        <button className={styles.btn} onClick={confirm}>{btnConfirm}</button>
      </div>
    </div>
  );
};
