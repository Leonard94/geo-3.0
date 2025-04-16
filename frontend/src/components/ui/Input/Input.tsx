import React from "react";
import styles from "./styles.module.scss";
import classnames from "classnames";

type TProps = {
  type: string;
  name?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  fullWidth?: boolean;
  error?: string | null;
  onFocus?: () => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
};

export const Input: React.FC<TProps> = (props) => {
  const {
    type,
    name,
    value,
    onChange,
    placeholder,
    label,
    error,
    onFocus,
    onBlur,
    style,
  } = props;

  const inputClass = classnames(styles.input, {
    [styles.input_invalid]: error,
  });

  return (
    <div style={style}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClass}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {error && <p className={styles.message}>{error}</p>}
    </div>
  );
};
