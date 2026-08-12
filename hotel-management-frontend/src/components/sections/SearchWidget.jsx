import { useState } from "react";
import Button from "../ui/Button";
import styles from "./SearchWidget.module.css";

export default function SearchWidget({ onSearch, loading }) {
  const today = new Date().toISOString().split("T")[0];
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!checkIn || !checkOut) {
      setError("Vui lòng chọn ngày nhận và trả phòng.");
      return;
    }
    if (checkIn >= checkOut) {
      setError("Ngày trả phòng phải sau ngày nhận phòng.");
      return;
    }
    onSearch({ checkIn, checkOut, guests });
  };

  return (
    <form className={styles.card} onSubmit={handleSubmit}>
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

      <div className={styles.field}>
        <label className={styles.label}>Số khách</label>
        <input
          type="number"
          min={1}
          max={10}
          className={styles.input}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        />
      </div>

      <Button type="submit" disabled={loading} fullWidth>
        {loading ? "Đang tìm..." : "Tìm phòng trống"}
      </Button>

      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}