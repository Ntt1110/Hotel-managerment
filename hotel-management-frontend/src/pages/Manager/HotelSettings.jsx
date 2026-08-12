import { useEffect, useState } from "react";
import ManagerLayout from "../../components/layout/ManagerLayout";
import TextField from "../../components/ui/TextField";
import Button from "../../components/ui/Button";
import AlertBox from "../../components/ui/AlertBox";
import LocationMap from "../../components/sections/LocationMap";
import { hotelInfoApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./HotelSettings.module.css";

export default function HotelSettings() {
  const { token } = useAuth();
  const [form, setForm] = useState({ name: "", address: "", phone: "", email: "" });
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    hotelInfoApi
      .get()
      .then((data) => {
        if (data) {
          setInfo(data);
          setForm({
            name: data.name || "",
            address: data.address || "",
            phone: data.phone || "",
            email: data.email || "",
          });
        }
      })
      .catch(() => setError("Không thể tải thông tin khách sạn."))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");

    if (!form.address.trim()) {
      setError("Vui lòng nhập địa chỉ.");
      return;
    }

    setSaving(true);
    try {
      const updated = await hotelInfoApi.update(form, token);
      setInfo(updated);
      setNotice("Đã cập nhật địa chỉ và định vị thành công.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ManagerLayout title="Cài đặt khách sạn">
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className={styles.grid}>
          <form className={styles.formCard} onSubmit={handleSubmit}>
            <AlertBox variant="success">{notice}</AlertBox>
            <AlertBox variant="error">{error}</AlertBox>

            <TextField
              label="Tên khách sạn"
              value={form.name}
              onChange={handleChange("name")}
            />
            <TextField
              label="Địa chỉ"
              placeholder="Vd: 12 đường Ven Biển, Hải Phòng"
              value={form.address}
              onChange={handleChange("address")}
            />
            <TextField
              label="Số điện thoại"
              value={form.phone}
              onChange={handleChange("phone")}
            />
            <TextField label="Email" value={form.email} onChange={handleChange("email")} />

            <p className={styles.hint}>
              Khi lưu, hệ thống sẽ tự động tìm tọa độ tương ứng với địa chỉ để
              hiển thị bản đồ ở trang chủ.
            </p>

            <Button type="submit" disabled={saving}>
              {saving ? "Đang định vị..." : "Lưu & định vị"}
            </Button>
          </form>

          <div className={styles.previewCard}>
            <h3 className={styles.previewTitle}>Xem trước vị trí</h3>
            {info?.location?.lat ? (
              <LocationMap
                lat={info.location.lat}
                lng={info.location.lng}
                name={info.name}
                address={info.address}
              />
            ) : (
              <p className={styles.noPreview}>
                Chưa có tọa độ. Nhập địa chỉ và lưu để xem bản đồ.
              </p>
            )}
          </div>
        </div>
      )}
    </ManagerLayout>
  );
}