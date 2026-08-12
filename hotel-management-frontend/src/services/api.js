const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Da co loi xay ra, vui long thu lai.");
  }

  return data;
}

export const authApi = {
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: { email, password } }),
  register: (payload) =>
    request("/auth/register", { method: "POST", body: payload }),
  getMe: (token) => request("/auth/me", { token }),
};

export const roomApi = {
  getRooms: (params = "") => request(`/rooms${params}`),
  getRoomById: (id) => request(`/rooms/${id}`),
  getAvailableRooms: (checkIn, checkOut) =>
    request(`/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}`),
  create: (payload, token) =>
    request("/rooms", { method: "POST", body: payload, token }),
  update: (id, payload, token) =>
    request(`/rooms/${id}`, { method: "PUT", body: payload, token }),
  remove: (id, token) =>
    request(`/rooms/${id}`, { method: "DELETE", token }),
  restore: (id, token) =>
    request(`/rooms/${id}/restore`, { method: "PUT", token }),
};

export const roomTypeApi = {
  getAll: () => request("/room-types"),
};

export const bookingApi = {
  create: (payload, token) =>
    request("/bookings", { method: "POST", body: payload, token }),
  getMy: (token) => request("/bookings/my", { token }),
  cancel: (id, token) =>
    request(`/bookings/${id}/cancel`, { method: "PUT", token }),
  getAll: (token, status) =>
    request(`/bookings${status ? `?status=${status}` : ""}`, { token }),
  updateStatus: (id, status, token) =>
    request(`/bookings/${id}/status`, {
      method: "PUT",
      body: { status },
      token,
    }),
};

export const hotelInfoApi = {
  get: () => request("/hotel-info"),
  update: (payload, token) =>
    request("/hotel-info", { method: "PUT", body: payload, token }),
};
export const serviceApi = {
  getAll: () => request("/services"),
};

export default request;