import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import AlertBox from "../ui/AlertBox";
import { useAuth } from "../../contexts/AuthContext";
import { bookingApi } from "../../services/api";
import styles from "./BookingForm.module.css";

export default function BookingForm({ room, services }) {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedServices, setSelectedServices] = useState([]);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut) - new Date(checkIn);
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  }, [checkIn, checkOut]);

  const roomTypePrice = room.roomTypeId?.basePrice || 0;

  const servicesTotal = useMemo(() => {
    return selectedServices.reduce((sum, sId) => {
      const svc = services.find((s) => s._id === sId);
      return sum + (svc ? svc.price : 0);
    }, 0);
  }, [selectedServices, services]);

  const totalPrice = roomTypePrice * nights + servicesTotal;

  const toggleService = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      navigate("/login");
      return;
    }
    if (!checkIn || !checkOut) {
      setError("Vui lòng chọn ngày nhận và trả phòng.");
      return;
    }
    if (nights <= 0) {
      setError("Ngày trả phòng phải sau ngày nhận phòng.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await bookingApi.create(
        {
          roomId: room._id,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          numberOfGuests: { adults, children },
          services: selectedServices.map((sId) => ({ serviceId: sId, quantity: 1 })),
          note,
        },
        token
      );

      navigate("/my-bookings", {
        state: { notice: `Đặt phòng thành công! Mã đặt phòng: ${result.bookingCode}` },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.card} onSubmit={handleSubmit}>
      <h3 className={styles.title}>Đặt phòng này</h3>

      <AlertBox variant="error">{error}</AlertBox>

      <div className={styles.dateRow}>
        <div className={styles.field}>
          <label className={styles.label}>Nhận phòng</label>
          <input
            type="date"
            className={styles.input}
            min={today}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Trả phòng</label>
          <input
            type="date"
            className={styles.input}
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.dateRow}>
        <div className={styles.field}>
          <label className={styles.label}>Người lớn</label>
          <input
            type="number"
            min={1}
            max={10}
            className={styles.input}
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Trẻ em</label>
          <input
            type="number"
            min={0}
            max={10}
            className={styles.input}
            value={children}
            onChange={(e) => setChildren(Number(e.target.value))}
          />
        </div>
      </div>

      {services.length > 0 && (
        <div className={styles.servicesBlock}>
          <label className={styles.label}>Dịch vụ thêm</label>
          {services.map((svc) => (
            <label key={svc._id} className={styles.serviceRow}>
              <span className={styles.serviceLeft}>
                <input
                  type="checkbox"
                  checked={selectedServices.includes(svc._id)}
                  onChange={() => toggleService(svc._id)}
                />
                {svc.name}
              </span>
              <span>{svc.price.toLocaleString("vi-VN")} đ</span>
            </label>
          ))}
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.label}>Ghi chú (không bắt buộc)</label>
        <textarea
          className={styles.textarea}
          rows={2}
          placeholder="Vd: cần thêm gối, đến muộn sau 22h..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryRow}>
          <span>
            {roomTypePrice.toLocaleString("vi-VN")} đ x {nights} đêm
          </span>
          <span>{(roomTypePrice * nights).toLocaleString("vi-VN")} đ</span>
        </div>
        {servicesTotal > 0 && (
          <div className={styles.summaryRow}>
            <span>Dịch vụ thêm</span>
            <span>{servicesTotal.toLocaleString("vi-VN")} đ</span>
          </div>
        )}
        <div className={styles.summaryTotal}>
          <span>Tổng cộng</span>
          <span>{totalPrice.toLocaleString("vi-VN")} đ</span>
        </div>
      </div>

      <Button type="submit" fullWidth disabled={submitting}>
        {!user
          ? "Đăng nhập để đặt phòng"
          : submitting
          ? "Đang xử lý..."
          : "Đặt phòng ngay"}
      </Button>
    </form>
  );
}