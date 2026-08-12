import RoomCard from "./RoomCard";
import styles from "./RoomGrid.module.css";

export default function RoomGrid({ rooms, loading }) {
  if (loading) {
    return <p className={styles.status}>Đang tải danh sách phòng...</p>;
  }

  if (!rooms || rooms.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>Chưa tìm thấy phòng phù hợp</p>
        <p className={styles.emptyDesc}>
          Thử chọn khoảng ngày khác, hoặc xem toàn bộ phòng của khách sạn.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {rooms.map((room) => (
        <RoomCard key={room._id} room={room} />
      ))}
    </div>
  );
}