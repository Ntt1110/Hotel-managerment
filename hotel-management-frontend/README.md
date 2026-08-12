# Hotel Management Frontend

Frontend React (Vite) cho he thong quan ly khach san, ket noi voi
`hotel-management-backend` qua REST API.

## Cai dat

```bash
cd hotel-management-frontend
npm install
cp .env.example .env
```

Mo file `.env`, kiem tra `VITE_API_URL` tro dung ve backend (mac dinh
`http://localhost:5000/api`).

## Chay du an

```bash
npm run dev
```

Truy cap: `http://localhost:5173`
Luu y: can chay song song backend (`npm run dev` trong thu muc
`hotel-management-backend`) de cac form goi API hoat dong.

## Cau truc thu muc

```
src/
├── components/
│   ├── ui/             Component tai su dung toan app (Button, TextField,
│   │                   Checkbox, RoleTabs, AlertBox, TextButton)
│   └── layout/          Khung layout dung chung (AuthLayout, KeyIllustration)
├── pages/                Tung man hinh, moi page co the co file .module.css rieng
│   ├── Login/
│   ├── Register/
│   ├── Home.jsx
│   ├── ForgotPassword.jsx
│   └── ManagerDashboard.jsx
├── contexts/
│   └── AuthContext.jsx   Quan ly trang thai dang nhap toan app
├── services/
│   └── api.js            Noi tap trung goi API, tu dong gan token
├── styles/
│   ├── tokens.css        Bien mau sac, font, spacing dung chung
│   └── global.css        Reset CSS va style nen tang
├── App.jsx                Khai bao route
└── main.jsx                Diem khoi dong app
```

## Quy uoc khi phat trien tiep

- **Component moi dung chung nhieu noi** → dat trong `components/ui/`,
  kem file `.module.css` rieng, khong hardcode mau ma dung bien trong
  `styles/tokens.css`.
- **Layout dung chung cho nhieu page** (vd man hinh xac thuc) → dat
  trong `components/layout/`.
- **Moi page** → 1 thu muc rieng trong `pages/`, co file `.jsx` va
  `.module.css` cung ten, chi chua style dac thu cua page do (khong lap
  lai style cua component con).
- **Goi API** → luon di qua `services/api.js`, khong fetch truc tiep
  trong component, de de kiem soat va tai su dung.
- **Trang thai dang nhap** → dung `useAuth()` tu `contexts/AuthContext`,
  khong tu luu token rai rac o cac page.

## Responsive

Cac breakpoint dang dung (khai bao trong tung file `.module.css` lien
quan):
- `max-width: 900px` — tablet, thu gon padding/kich thuoc chu panel
  thuong hieu
- `max-width: 560px` — mobile, xep chong layout theo chieu doc, an bot
  chi tiet trang tri o panel thuong hieu de uu tien khong gian cho form
