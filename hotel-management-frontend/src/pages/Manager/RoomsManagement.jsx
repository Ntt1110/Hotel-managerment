import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import ManagerLayout from "../../components/layout/ManagerLayout";
import Button from "../../components/ui/Button";
import AlertBox from "../../components/ui/AlertBox";
import RoomsTable from "../../components/manager/RoomsTable";
import RoomFormModal from "../../components/manager/RoomFormModal";
import { roomApi, roomTypeApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./RoomsManagement.module.css";

export default function RoomsManagement() {
  const { token } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([roomApi.getRooms(), roomTypeApi.getAll()])
      .then(([roomsData, roomTypesData]) => {
        setRooms(roomsData);
        setRoomTypes(roomTypesData);
      })
      .catch(() => setError("Không thể tải dữ liệu phòng."))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  const openCreateModal = () => {
    setEditingRoom(null);
    setModalOpen(true);
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    if (editingRoom) {
      await roomApi.update(editingRoom._id, formData, token);
      setNotice("Đã cập nhật phòng thành công.");
    } else {
      await roomApi.create(formData, token);
      setNotice("Đã thêm phòng mới thành công.");
    }
    loadData();
  };

  const handleDelete = async (room) => {
    const confirmed = window.confirm(
      `Xóa phòng ${room.roomNumber}? Phòng sẽ được ẩn khỏi danh sách, có thể khôi phục sau.`
    );
    if (!confirmed) return;

    try {
      await roomApi.remove(room._id, token);
      setNotice(`Đã xóa phòng ${room.roomNumber}.`);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ManagerLayout title="Quản lý phòng">
      <div className={styles.headerRow}>
        <p className={styles.subtitle}>
          Quản lý toàn bộ phòng của khách sạn — thêm mới, chỉnh sửa, hoặc xóa.
        </p>
        <Button onClick={openCreateModal}>
          <span className={styles.btnInner}>
            <Plus size={16} strokeWidth={2} />
            Thêm phòng
          </span>
        </Button>
      </div>

      <AlertBox variant="success">{notice}</AlertBox>
      <AlertBox variant="error">{error}</AlertBox>

      <RoomsTable
        rooms={rooms}
        loading={loading}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      <RoomFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        roomTypes={roomTypes}
        editingRoom={editingRoom}
        onSubmit={handleSubmit}
      />
    </ManagerLayout>
  );
}