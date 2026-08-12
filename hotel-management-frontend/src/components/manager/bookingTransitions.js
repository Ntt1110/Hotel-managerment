export const BOOKING_TRANSITIONS = {
  pending: [
    { status: "confirmed", label: "Xác nhận" },
    { status: "cancelled", label: "Hủy", danger: true },
  ],
  confirmed: [
    { status: "checked-in", label: "Nhận phòng" },
    { status: "cancelled", label: "Hủy", danger: true },
  ],
  "checked-in": [{ status: "checked-out", label: "Trả phòng" }],
  "checked-out": [],
  cancelled: [],
};