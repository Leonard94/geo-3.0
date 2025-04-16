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
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (touched[name as keyof typeof touched]) {
      let fieldError: string | null = null;

      if (name === "name") {
        fieldError = validateChannelName(value);
      } else if (name === "url") {
        fieldError = validateChannelUrl(value);
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
      fieldError = validateChannelUrl(value);
    }

    setErrors((prev) => ({
      ...prev,
      [name]: fieldError || undefined,
    }));
  };

  const validate = (): boolean => {
    const validationErrors = validateChannel(formData);
    setErrors(validationErrors);
    setTouched({ name: true, url: true });

    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      onSubmit(formData);
    }
  };

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
            <Input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleChange}
              onBlur={handleBlur}
              label="URL канала"
              placeholder="https://example.com или t.me/channel"
              error={errors.url}
              fullWidth
            />
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
