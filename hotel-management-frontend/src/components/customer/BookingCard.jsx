import StatusBadge from "../ui/StatusBadge";
import Button from "../ui/Button";
import styles from "./BookingCard.module.css";

const CANCELABLE_STATUSES = ["pending", "confirmed"];

export default function BookingCard({ booking, onCancel }) {
  const roomType = booking.roomId?.roomTypeId || {};
  const canCancel = CANCELABLE_STATUSES.includes(booking.status);

  return (
    <div className={styles.card}>
      <div className={styles.thumb}>
        <span>{roomType.name ? roomType.name.charAt(0) : "P"}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.headRow}>
          <div>
            <h3 className={styles.roomName}>{roomType.name || "Phòng"}</h3>
            <p className={styles.code}>{booking.bookingCode}</p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className={styles.infoRow}>
          <span>
            {new Date(booking.checkInDate).toLocaleDateString("vi-VN")} —{" "}
            {new Date(booking.checkOutDate).toLocaleDateString("vi-VN")}
          </span>
          <span>Phòng {booking.roomId?.roomNumber || "—"}</span>
        </div>

        <div className={styles.footRow}>
          <span className={styles.price}>
            {booking.totalPrice?.toLocaleString("vi-VN")} đ
          </span>
          {canCancel && (
            <Button variant="ghost" onClick={() => onCancel(booking)}>
              Hủy đặt phòng
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}