import { Link } from "react-router-dom";
import styles from "./RoomCard.module.css";

export default function RoomCard({ room }) {
  const roomType = room.roomTypeId || {};
  const initial = roomType.name ? roomType.name.charAt(0) : "P";

  return (
    <article className={styles.card}>
      <div className={styles.thumb}>
        <span>{initial}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.headRow}>
          <h3 className={styles.name}>{roomType.name || "Phòng"}</h3>
          <span className={styles.roomNumber}>Phòng {room.roomNumber}</span>
        </div>

        {roomType.description && (
          <p className={styles.desc}>{roomType.description}</p>
        )}

        <div className={styles.tags}>
          {(roomType.amenities || []).slice(0, 3).map((a) => (
            <span key={a} className={styles.tag}>
              {a}
            </span>
          ))}
        </div>

        <div className={styles.footRow}>
          <div className={styles.price}>
            {roomType.basePrice
              ? `${roomType.basePrice.toLocaleString("vi-VN")} đ`
              : "Liên hệ"}
            <span className={styles.perNight}> / đêm</span>
          </div>
          <Link to={`/rooms/${room._id}`} className={styles.viewBtn}>
            Xem chi tiết
          </Link>
        </div>
      </div>
    </article>
  );
}