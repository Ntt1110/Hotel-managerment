import { useEffect, useMemo, useState } from "react";
import ManagerLayout from "../../components/layout/ManagerLayout";
import StatCard from "../../components/ui/StatCard";
import RoleTabs from "../../components/ui/RoleTabs";
import BookingsTable from "../../components/manager/BookingsTable";
import { bookingApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Dashboard.module.css";

const FILTER_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chờ xác nhận" },
  { value: "checked-in", label: "Đang lưu trú" },
  { value: "checked-out", label: "Đã trả phòng" },
];

export default function Dashboard() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    bookingApi
      .getAll(token)
      .then((data) => setBookings(data))
      .catch(() => setError("Không thể tải danh sách đặt phòng."))
      .finally(() => setLoading(false));
  }, [token]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const checkedIn = bookings.filter((b) => b.status === "checked-in").length;
    const revenue = bookings
      .filter((b) => ["confirmed", "checked-in", "checked-out"].includes(b.status))
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    return { total, pending, checkedIn, revenue };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    if (filter === "all") return bookings;
    return bookings.filter((b) => b.status === filter);
  }, [bookings, filter]);

  return (
    <ManagerLayout title="Tổng quan">
      <div className={styles.statsGrid}>
        <StatCard label="Tổng đặt phòng" value={stats.total} />
        <StatCard label="Chờ xác nhận" value={stats.pending} hint="Cần xử lý sớm" />
        <StatCard label="Đang lưu trú" value={stats.checkedIn} />
        <StatCard
          label="Doanh thu ước tính"
          value={`${stats.revenue.toLocaleString("vi-VN")} đ`}
          hint="Từ các đặt phòng đã xác nhận trở lên"
        />
      </div>

      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h2 className={styles.sectionTitle}>Đặt phòng gần đây</h2>
          <RoleTabs options={FILTER_OPTIONS} value={filter} onChange={setFilter} />
        </div>

        {error && <p className={styles.error}>{error}</p>}
        <BookingsTable bookings={filteredBookings} loading={loading} />
      </div>
    </ManagerLayout>
  );
}