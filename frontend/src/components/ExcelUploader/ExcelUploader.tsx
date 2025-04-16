import { useRef, useState } from "react";
import { EntityType } from "../../DATA";
import { processExcelFile } from "./processExcelFile";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import styles from "./styles.module.scss";
import DownloadIcon from '@mui/icons-material/Download';

interface IProps {
  entityType: EntityType;
  onUploadComplete: () => void;
}

export const ExcelUploader: React.FC<IProps> = ({
  entityType,
  onUploadComplete,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    try {
      await processExcelFile(file, entityType);
      onUploadComplete();
      toast.success("Файл успешно загружен");
    } catch (error) {
      console.error("Ошибка при загрузке файла:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Произошла ошибка при загрузке файла";

      toast.error(`Ошибка: ${errorMessage}`);
    } finally {
      setIsLoading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className={styles.container}>
      <input
        className={styles.fileInput}
        disabled={isLoading}
        type="file"
        accept=".xlsx, .xls"
        ref={inputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            handleUpload(file);
          }
        }}
      />
      <div className={styles.iconWrapper}>
        {isLoading ? <CircularProgress size={24} /> : <DownloadIcon />}
      </div>
    </div>
  );
};
