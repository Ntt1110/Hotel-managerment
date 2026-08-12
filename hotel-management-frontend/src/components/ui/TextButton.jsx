import styles from "./TextButton.module.css";

/**
 * Nut dang text nho, dung cho hanh dong phu (vd: Hien/An mat khau, Quen mat khau).
 */
export default function TextButton({ children, onClick, type = "button" }) {
  return (
    <button type={type} className={styles.textButton} onClick={onClick}>
      {children}
    </button>
  );
}
