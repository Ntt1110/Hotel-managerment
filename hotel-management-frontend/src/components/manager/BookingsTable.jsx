import StatusBadge from "../ui/StatusBadge";
import { BOOKING_TRANSITIONS } from "./bookingTransitions";
import styles from "./BookingsTable.module.css";

export default function BookingsTable({ bookings, loading, onStatusChange, onRowClick }) {
  if (loading) {
    return <p className={styles.status}>Đang tải danh sách đặt phòng...</p>;
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>Chưa có đặt phòng nào</p>
        <p className={styles.emptyDesc}>
          Các đặt phòng mới từ khách hàng sẽ xuất hiện tại đây.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã đặt phòng</th>
            <th>Khách hàng</th>
            <th>Phòng</th>
            <th>Nhận phòng</th>
            <th>Trả phòng</th>
            <th>Trạng thái</th>
            <th>Tổng tiền</th>
            {onStatusChange && <th></th>}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => {
            const nextActions = BOOKING_TRANSITIONS[b.status] || [];
            return (
              <tr
                key={b._id}
                className={onRowClick ? styles.clickableRow : ""}
                onClick={() => onRowClick && onRowClick(b)}
              >
                <td className={styles.code}>{b.bookingCode}</td>
                <td>{b.customerId?.fullName || "—"}</td>
                <td>{b.roomId?.roomNumber || "—"}</td>
                <td>{new Date(b.checkInDate).toLocaleDateString("vi-VN")}</td>
                <td>{new Date(b.checkOutDate).toLocaleDateString("vi-VN")}</td>
                <td>
                  <StatusBadge status={b.status} />
                </td>
                <td className={styles.price}>
                  {b.totalPrice?.toLocaleString("vi-VN")} đ
                </td>
                {onStatusChange && (
                  <td className={styles.actions}>
                    {nextActions.length === 0 && <span className={styles.noAction}>—</span>}
                    {nextActions.map((action) => (
                      <button
                        key={action.status}
                        className={`${styles.actionBtn} ${
                          action.danger ? styles.actionDanger : styles.actionPrimary
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onStatusChange(b, action.status);
                        }}
                      >
                        {action.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}