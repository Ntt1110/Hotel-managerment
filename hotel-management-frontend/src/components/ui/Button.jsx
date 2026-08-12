import styles from "./Button.module.css";

/**
 * Button dung chung toan app.
 * variant: "primary" | "ghost"
 * fullWidth: boolean
 */
export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  type = "button",
  disabled = false,
  onClick,
  ...rest
}) {
  const classNames = [
    styles.button,
    styles[variant],
    fullWidth ? styles.fullWidth : "",
  ].join(" ");

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
