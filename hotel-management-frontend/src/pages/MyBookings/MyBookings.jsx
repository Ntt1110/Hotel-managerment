import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import AlertBox from "../../components/ui/AlertBox";
import BookingCard from "../../components/customer/BookingCard";
import { bookingApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./MyBookings.module.css";

const CANCEL_CONFIRM_MSG = "Hủy đặt phòng này? Hành động này không thể hoàn tác.";

export default function MyBookings() {
  const { token } = useAuth();
  const location = useLocation();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(location.state?.notice || "");

  const loadBookings = () => {
    setLoading(true);
    bookingApi
      .getMy(token)
      .then((data) => setBookings(data))
      .catch(() => setError("Không thể tải danh sách đặt phòng."))
      .finally(() => setLoading(false));
  };

  useEffect(loadBookings, [token]);

  const handleCancel = async (booking) => {
    if (!window.confirm(CANCEL_CONFIRM_MSG)) return;

    setError("");
    try {
      await bookingApi.cancel(booking._id, token);
      setNotice(`Đã hủy đặt phòng ${booking.bookingCode}.`);
      loadBookings();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <Navbar />

      <div className={styles.wrap}>
        <h1 className={styles.title}>Đặt phòng của tôi</h1>

        <AlertBox variant="success">{notice}</AlertBox>
        <AlertBox variant="error">{error}</AlertBox>

        {loading && <p className={styles.status}>Đang tải...</p>}

        {!loading && bookings.length === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Bạn chưa có đặt phòng nào</p>
            <p className={styles.emptyDesc}>
              Khám phá các phòng tại trang chủ để bắt đầu kỳ nghỉ tiếp theo.
            </p>
          </div>
        )}

        <div className={styles.list}>
          {bookings.map((b) => (
            <BookingCard key={b._id} booking={b} onCancel={handleCancel} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}