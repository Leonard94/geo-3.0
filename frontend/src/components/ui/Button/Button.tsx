import React from "react";
import styles from "./styles.module.scss";
import classnames from "classnames";

type TProps = {
  children: React.ReactNode;
  typeView: "primary" | "default" | "text";
  type?: "button" | "submit";
  onClick?: () => void;
  full?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
};

export const Button: React.FC<TProps> = (props) => {
  const {
    children,
    typeView,
    onClick,
    full,
    disabled,
    style,
    type = "button",
  } = props;

  const clickHandler = (): void => {
    if (onClick) {
      onClick();
    }
  };

  const btnClass = classnames(styles.btn, {
    [styles[typeView]]: typeView,
    [styles.btn_full]: full,
  });

  return (
    <button
      className={btnClass}
      onClick={clickHandler}
      disabled={disabled}
      type={type}
      style={style}
    >
      {children}
    </button>
  );
};
