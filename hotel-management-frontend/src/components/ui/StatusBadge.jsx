import styles from "./StatusBadge.module.css";

const STATUS_MAP = {
  pending: { label: "Chờ xác nhận", cls: "pending" },
  confirmed: { label: "Đã xác nhận", cls: "confirmed" },
  "checked-in": { label: "Đang lưu trú", cls: "checkedIn" },
  "checked-out": { label: "Đã trả phòng", cls: "checkedOut" },
  cancelled: { label: "Đã hủy", cls: "cancelled" },
};

export default function StatusBadge({ status }) {
  const info = STATUS_MAP[status] || { label: status, cls: "pending" };
  return (
    <span className={`${styles.badge} ${styles[info.cls]}`}>{info.label}</span>
  );
}