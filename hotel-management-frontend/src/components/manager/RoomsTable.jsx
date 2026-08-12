import { Pencil, Trash2 } from "lucide-react";
import styles from "./RoomsTable.module.css";

const STATUS_LABEL = {
  available: { text: "Còn trống", cls: "available" },
  occupied: { text: "Đang sử dụng", cls: "occupied" },
  maintenance: { text: "Bảo trì", cls: "maintenance" },
};

export default function RoomsTable({ rooms, loading, onEdit, onDelete }) {
  if (loading) {
    return <p className={styles.status}>Đang tải danh sách phòng...</p>;
  }

  if (!rooms || rooms.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>Chưa có phòng nào</p>
        <p className={styles.emptyDesc}>Bấm "Thêm phòng" để bắt đầu tạo phòng đầu tiên.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Số phòng</th>
            <th>Tầng</th>
            <th>Loại phòng</th>
            <th>Giá / đêm</th>
            <th>Trạng thái</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => {
            const statusInfo = STATUS_LABEL[room.status] || STATUS_LABEL.available;
            return (
              <tr key={room._id}>
                <td className={styles.roomNumber}>{room.roomNumber}</td>
                <td>{room.floor ?? "—"}</td>
                <td>{room.roomTypeId?.name || "—"}</td>
                <td>
                  {room.roomTypeId?.basePrice
                    ? `${room.roomTypeId.basePrice.toLocaleString("vi-VN")} đ`
                    : "—"}
                </td>
                <td>
                  <span className={`${styles.badge} ${styles[statusInfo.cls]}`}>
                    {statusInfo.text}
                  </span>
                </td>
                <td className={styles.actions}>
                  <button
                    className={styles.iconBtn}
                    onClick={() => onEdit(room)}
                    aria-label="Sửa phòng"
                  >
                    <Pencil size={16} strokeWidth={1.8} />
                  </button>
                  <button
                    className={`${styles.iconBtn} ${styles.danger}`}
                    onClick={() => onDelete(room)}
                    aria-label="Xóa phòng"
                  >
                    <Trash2 size={16} strokeWidth={1.8} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}