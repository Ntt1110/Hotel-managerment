import { useEffect, useMemo, useState } from "react";
import ManagerLayout from "../../components/layout/ManagerLayout";
import RoleTabs from "../../components/ui/RoleTabs";
import TextField from "../../components/ui/TextField";
import AlertBox from "../../components/ui/AlertBox";
import BookingsTable from "../../components/manager/BookingsTable";
import BookingDetailModal from "../../components/manager/BookingDetailModal";
import { bookingApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./BookingsManagement.module.css";

const FILTER_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "checked-in", label: "Đang ở" },
  { value: "checked-out", label: "Đã trả phòng" },
  { value: "cancelled", label: "Đã hủy" },
];

const CANCEL_CONFIRM_MSG =
  "Hủy đặt phòng này? Hành động này không thể hoàn tác.";

export default function BookingsManagement() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadBookings = () => {
    setLoading(true);
    bookingApi
      .getAll(token)
      .then((data) => setBookings(data))
      .catch(() => setError("Không thể tải danh sách đặt phòng."))
      .finally(() => setLoading(false));
  };

  useEffect(loadBookings, [token]);

  const filteredBookings = useMemo(() => {
    let result = bookings;
    if (filter !== "all") {
      result = result.filter((b) => b.status === filter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (b) =>
          b.bookingCode.toLowerCase().includes(q) ||
          b.customerId?.fullName?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [bookings, filter, search]);

  const handleStatusChange = async (booking, nextStatus) => {
    if (nextStatus === "cancelled" && !window.confirm(CANCEL_CONFIRM_MSG)) {
      return;
    }

    setError("");
    try {
      await bookingApi.updateStatus(booking._id, nextStatus, token);
      setNotice(`Đã cập nhật đặt phòng ${booking.bookingCode}.`);
      setSelectedBooking(null);
      loadBookings();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ManagerLayout title="Đặt phòng">
      <div className={styles.toolbar}>
        <RoleTabs options={FILTER_OPTIONS} value={filter} onChange={setFilter} />
        <div className={styles.searchWrap}>
          <TextField
            placeholder="Tìm theo mã đặt phòng hoặc tên khách..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <AlertBox variant="success">{notice}</AlertBox>
      <AlertBox variant="error">{error}</AlertBox>

      <BookingsTable
        bookings={filteredBookings}
        loading={loading}
        onStatusChange={handleStatusChange}
        onRowClick={setSelectedBooking}
      />

      <BookingDetailModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onStatusChange={handleStatusChange}
      />
    </ManagerLayout>
  );
}