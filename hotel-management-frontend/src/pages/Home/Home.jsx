import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Hero from "../../components/sections/Hero";
import RoomGrid from "../../components/sections/RoomGrid";
import { roomApi } from "../../services/api";
import styles from "./Home.module.css";

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("Phòng nổi bật");
  const [error, setError] = useState("");

  // Tai danh sach phong noi bat khi trang duoc mo
  useEffect(() => {
    roomApi
      .getRooms()
      .then((data) => setRooms(data))
      .catch(() => setError("Không thể tải danh sách phòng lúc này."))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async ({ checkIn, checkOut }) => {
    setSearching(true);
    setError("");
    try {
      const data = await roomApi.getAvailableRooms(checkIn, checkOut);
      setRooms(data);
      setSectionTitle("Phòng trống trong khoảng ngày đã chọn");
    } catch (err) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div>
      <Navbar />
      <Hero onSearch={handleSearch} searching={searching} />

      <section className={styles.roomsSection} id="rooms">
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
          {error && <p className={styles.error}>{error}</p>}
          <RoomGrid rooms={rooms} loading={loading} />
        </div>
      </section>

      <section className={styles.aboutSection} id="about">
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Vì sao chọn chúng tôi</h2>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutItem}>
              <h3 className={styles.aboutHeading}>Vị trí ven biển</h3>
              <p className={styles.aboutText}>
                Chỉ 5 phút đi bộ ra bãi biển, trung tâm thành phố ngay bên
                cạnh.
              </p>
            </div>
            <div className={styles.aboutItem}>
              <h3 className={styles.aboutHeading}>Dịch vụ trọn gói</h3>
              <p className={styles.aboutText}>
                Ăn sáng, đưa đón sân bay, spa — đặt kèm ngay khi giữ phòng.
              </p>
            </div>
            <div className={styles.aboutItem}>
              <h3 className={styles.aboutHeading}>Đặt phòng linh hoạt</h3>
              <p className={styles.aboutText}>
                Hủy miễn phí trước 48 giờ, xác nhận tức thì qua hệ thống.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}