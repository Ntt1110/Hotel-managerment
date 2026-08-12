import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import TextField from "../ui/TextField";
import Select from "../ui/Select";
import Button from "../ui/Button";
import AlertBox from "../ui/AlertBox";
import styles from "./RoomFormModal.module.css";

const STATUS_OPTIONS = [
  { value: "available", label: "Còn trống" },
  { value: "occupied", label: "Đang sử dụng" },
  { value: "maintenance", label: "Bảo trì" },
];

const EMPTY_FORM = {
  roomNumber: "",
  floor: "",
  roomTypeId: "",
  status: "available",
};

export default function RoomFormModal({ open, onClose, roomTypes, editingRoom, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingRoom) {
      setForm({
        roomNumber: editingRoom.roomNumber || "",
        floor: editingRoom.floor ?? "",
        roomTypeId: editingRoom.roomTypeId?._id || editingRoom.roomTypeId || "",
        status: editingRoom.status || "available",
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError("");
  }, [editingRoom, open]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.roomNumber || !form.roomTypeId) {
      setError("Vui lòng nhập số phòng và chọn loại phòng.");
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        ...form,
        floor: form.floor ? Number(form.floor) : undefined,
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={editingRoom ? "Sửa phòng" : "Thêm phòng mới"}>
      <form onSubmit={handleSubmit}>
        <AlertBox variant="error">{error}</AlertBox>

        <TextField
          label="Số phòng"
          placeholder="Vd: 301"
          value={form.roomNumber}
          onChange={handleChange("roomNumber")}
        />

        <TextField
          label="Tầng"
          type="number"
          placeholder="Vd: 3"
          value={form.floor}
          onChange={handleChange("floor")}
        />

        <Select
          label="Loại phòng"
          placeholder="Chọn loại phòng"
          value={form.roomTypeId}
          onChange={handleChange("roomTypeId")}
          options={roomTypes.map((rt) => ({ value: rt._id, label: rt.name }))}
        />

        <Select
          label="Trạng thái"
          value={form.status}
          onChange={handleChange("status")}
          options={STATUS_OPTIONS}
        />

        <div className={styles.actions}>
          <Button variant="ghost" type="button" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}