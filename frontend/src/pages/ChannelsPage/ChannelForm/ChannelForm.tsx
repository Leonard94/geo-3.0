import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { Button } from "../../../components/ui/Button/Button";
import { Modal } from "../../../components/ui/Modal/Modal";
import { Input } from "../../../components/ui/Input/Input";
import { IChannel } from "../../../store/channels/channelsTypes";
import {
  IChannelValidationErrors,
  validateChannel,
  validateChannelName,
  validateChannelUrl,
} from "../../../utils/channels.utils";

interface ChannelFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (channel: Omit<IChannel, "id"> & { id?: string }) => void;
  initialData?: IChannel | null;
}

export const ChannelForm: React.FC<ChannelFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<
    Omit<IChannel, "id"> & { id?: string }
  >({
    name: "",
    url: "",
  });
  const [errors, setErrors] = useState<IChannelValidationErrors>({});
  const [touched, setTouched] = useState<{ name: boolean; url: boolean }>({
    name: false,
    url: false,
  });

  const extractChannelName = (fullUrl: string): string => {
    if (fullUrl.startsWith("t.me/")) {
      return fullUrl.substring(5);
    }
    return fullUrl;
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        name: initialData.name,
        url: initialData.url,
      });
    } else {
      setFormData({
        name: "",
        url: "",
      });
    }
    setErrors({});
    setTouched({ name: false, url: false });
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "url") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setTouched((prev) => ({ ...prev, [name]: true }));

    if (touched[name as keyof typeof touched]) {
      let fieldError: string | null = null;

      if (name === "name") {
        fieldError = validateChannelName(value);
      } else if (name === "url") {
        fieldError = validateChannelUrl("t.me/" + value);
      }

      setErrors((prev) => ({
        ...prev,
        [name]: fieldError || undefined,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setTouched((prev) => ({ ...prev, [name]: true }));

    let fieldError: string | null = null;

    if (name === "name") {
      fieldError = validateChannelName(value);
    } else if (name === "url") {
      fieldError = validateChannelUrl("t.me/" + value);
    }

    setErrors((prev) => ({
      ...prev,
      [name]: fieldError || undefined,
    }));
  };

  const validate = (): boolean => {
    const validationData = {
      ...formData,
      url: "t.me/" + formData.url,
    };

    const validationErrors = validateChannel(validationData);
    setErrors(validationErrors);
    setTouched({ name: true, url: true });

    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      const submissionData = {
        ...formData,
        url: formData.url.startsWith("t.me/")
          ? formData.url
          : "t.me/" + formData.url,
      };

      onSubmit(submissionData);
    }
  };

  useEffect(() => {
    if (initialData?.url) {
      setFormData((prev) => ({
        ...prev,
        url: extractChannelName(initialData.url),
      }));
    }
  }, [initialData]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          {initialData ? "Редактировать канал" : "Добавить новый канал"}
        </h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formFields}>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              label="Название канала"
              placeholder="Введите название канала"
              error={errors.name}
              fullWidth
            />
            <div className={styles.urlInputContainer}>
              <div className={styles.urlPrefix}>t.me/</div>
              <Input
                type="text"
                name="url"
                value={formData.url}
                onChange={handleChange}
                onBlur={handleBlur}
                label="Имя канала"
                placeholder="channel_name"
                error={errors.url}
                fullWidth
              />
            </div>
            <div className={styles.buttons}>
              <Button typeView="default" type="button" onClick={onClose}>
                Отмена
              </Button>
              <Button typeView="primary" type="submit">
                {initialData ? "Сохранить" : "Добавить"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};
