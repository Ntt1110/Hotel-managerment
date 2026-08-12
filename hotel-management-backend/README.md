# Hotel Management Backend

Backend REST API cho he thong quan ly khach san, 2 actor: **customer** va **manager**.

## Cong nghe
- Node.js + Express (CommonJS)
- MongoDB + Mongoose
- Xac thuc: JWT
- Ma hoa mat khau: bcryptjs

## Cai dat

```bash
cd hotel-management-backend
npm install
```

Tao file `.env` (copy tu `.env.example`) va chinh gia tri cho phu hop:

```bash
cp .env.example .env
```

## Chay du an

```bash
# che do development (auto reload khi sua code)
npm run dev

# che do production
npm start
```

Server mac dinh chay tai: `http://localhost:5000`
Kiem tra server song: `GET http://localhost:5000/api/health`

## Danh sach API chinh

### Auth (`/api/auth`)
| Method | Endpoint | Quyen |
|---|---|---|
| POST | /register | Public |
| POST | /login | Public |
| GET | /me | Da dang nhap |

### Rooms (`/api/rooms`)
| Method | Endpoint | Quyen |
|---|---|---|
| GET | / | Public |
| GET | /available?checkIn=&checkOut= | Public |
| GET | /:id | Public |
| POST | / | Manager |
| PUT | /:id | Manager |
| DELETE | /:id | Manager |

### Room Types (`/api/room-types`)
| Method | Endpoint | Quyen |
|---|---|---|
| GET | / | Public |
| POST / PUT / DELETE | / | Manager |

### Bookings (`/api/bookings`)
| Method | Endpoint | Quyen |
|---|---|---|
| POST | / | Customer |
| GET | /my | Customer |
| PUT | /:id/cancel | Customer |
| GET | / | Manager |
| PUT | /:id/status | Manager |
| GET | /:id | Chu booking hoac Manager |

### Services (`/api/services`)
| Method | Endpoint | Quyen |
|---|---|---|
| GET | / | Public |
| POST / PUT / DELETE | / | Manager |

### Payments (`/api/payments`)
| Method | Endpoint | Quyen |
|---|---|---|
| POST | / | Customer |
| GET | /booking/:bookingId | Da dang nhap |
| GET | / | Manager |

### Reviews (`/api/reviews`)
| Method | Endpoint | Quyen |
|---|---|---|
| POST | / | Customer |
| GET | /room/:roomId | Public |

## Luu y phan quyen manager
Dang ky cong khai (`/api/auth/register`) luon tao tai khoan **customer**.
De tao tai khoan **manager**, hien tai can insert truc tiep vao MongoDB
(vi du qua Compass hoac mongosh), hoac xay dung them API rieng cho
manager hien huu tao manager moi (khuyen nghi cho buoc phat trien tiep theo).
