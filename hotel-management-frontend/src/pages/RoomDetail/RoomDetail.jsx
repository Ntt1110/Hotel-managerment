import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import BookingForm from "../../components/sections/BookingForm";
import { roomApi, serviceApi } from "../../services/api";
import styles from "./RoomDetail.module.css";

export default function RoomDetail() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([roomApi.getRoomById(id), serviceApi.getAll()])
      .then(([roomData, servicesData]) => {
        setRoom(roomData);
        setServices(servicesData);
      })
      .catch(() => setError("Không tìm thấy phòng này hoặc đã có lỗi xảy ra."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <p className={styles.status}>Đang tải thông tin phòng...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div>
        <Navbar />
        <div className={styles.status}>
          <p>{error || "Không tìm thấy phòng này."}</p>
          <Link to="/" className={styles.backLink}>
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const roomType = room.roomTypeId || {};

  return (
    <div>
      <Navbar />

      <div className={styles.wrap}>
        <Link to="/" className={styles.backLink}>
          ← Quay lại trang chủ
        </Link>

        <div className={styles.grid}>
          <div className={styles.main}>
            <div className={styles.thumb}>
              <span>{roomType.name ? roomType.name.charAt(0) : "P"}</span>
            </div>

            <div className={styles.headRow}>
              <h1 className={styles.title}>{roomType.name || "Phòng"}</h1>
              <span className={styles.roomNumber}>Phòng {room.roomNumber}</span>
            </div>

            <p className={styles.price}>
              {roomType.basePrice?.toLocaleString("vi-VN")} đ
              <span className={styles.perNight}> / đêm</span>
            </p>

            {roomType.description && (
              <p className={styles.description}>{roomType.description}</p>
            )}

            {roomType.capacity && (
              <p className={styles.capacity}>
                Sức chứa: {roomType.capacity.adults} người lớn
                {roomType.capacity.children ? `, ${roomType.capacity.children} trẻ em` : ""}
              </p>
            )}

            {roomType.amenities?.length > 0 && (
              <div className={styles.tags}>
                {roomType.amenities.map((a) => (
                  <span key={a} className={styles.tag}>
                    {a}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className={styles.side}>
            <BookingForm room={room} services={services} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}