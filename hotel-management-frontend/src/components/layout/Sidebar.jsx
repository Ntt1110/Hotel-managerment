import { NavLink } from "react-router-dom";
import { LayoutDashboard, BedDouble, CalendarCheck, Sparkles, Settings } from "lucide-react";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { to: "/manager/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { to: "/manager/rooms", label: "Quản lý phòng", icon: BedDouble },
  { to: "/manager/bookings", label: "Đặt phòng", icon: CalendarCheck },
  { to: "/manager/services", label: "Dịch vụ", icon: Sparkles },
  { to: "/manager/settings", label: "Cài đặt", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>Grand Thành Trung</div>
      <div className={styles.brandSub}>Khu vực quản lý</div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }
          >
            <Icon size={18} strokeWidth={1.8} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}