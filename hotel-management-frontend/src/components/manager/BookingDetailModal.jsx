import Modal from "../ui/Modal";
import StatusBadge from "../ui/StatusBadge";
import { BOOKING_TRANSITIONS } from "./bookingTransitions";
import styles from "./BookingDetailModal.module.css";

export default function BookingDetailModal({ booking, onClose, onStatusChange }) {
  if (!booking) return null;

  const nextActions = BOOKING_TRANSITIONS[booking.status] || [];

  const row = (label, value) => (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{value}</span>
    </div>
  );

  return (
    <Modal open={!!booking} onClose={onClose} title={`Đặt phòng ${booking.bookingCode}`}>
      <div className={styles.statusRow}>
        <StatusBadge status={booking.status} />
      </div>

      {row("Khách hàng", booking.customerId?.fullName || "—")}
      {row("Email", booking.customerId?.email || "—")}
      {row("Điện thoại", booking.customerId?.phone || "—")}
      {row("Phòng", booking.roomId?.roomNumber || "—")}
      {row("Nhận phòng", new Date(booking.checkInDate).toLocaleDateString("vi-VN"))}
      {row("Trả phòng", new Date(booking.checkOutDate).toLocaleDateString("vi-VN"))}
      {row(
        "Số khách",
        `${booking.numberOfGuests?.adults ?? 0} người lớn, ${booking.numberOfGuests?.children ?? 0} trẻ em`
      )}
      {row("Tổng tiền", `${booking.totalPrice?.toLocaleString("vi-VN")} đ`)}
      {booking.note && row("Ghi chú", booking.note)}

      {nextActions.length > 0 && (
        <div className={styles.actionRow}>
          {nextActions.map((action) => (
            <button
              key={action.status}
              className={`${styles.actionBtn} ${
                action.danger ? styles.actionDanger : styles.actionPrimary
              }`}
              onClick={() => onStatusChange(booking, action.status)}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
}