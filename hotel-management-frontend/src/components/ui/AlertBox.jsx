import styles from "./AlertBox.module.css";

/**
 * Hop thong bao dung chung. variant: "error" | "success"
 */
export default function AlertBox({ variant = "error", children }) {
  if (!children) return null;
  return <div className={`${styles.box} ${styles[variant]}`}>{children}</div>;
}
