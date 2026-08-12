import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../ui/Button";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { to: "/", label: "Trang chủ" },
  { to: "/#rooms", label: "Phòng" },
  { to: "/#about", label: "Giới thiệu" },
  { to: "/#contact", label: "Liên hệ" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          Grand Thành Trung Hotel
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.to} className={styles.navLink}>
              {link.label}
            </a>
          ))}

          <div className={styles.navActions}>
            {user ? (
              <>
                {user.role === "customer" && (
      <Link to="/my-bookings" className={styles.navLink}>
        Đặt phòng của tôi
      </Link>
    )}
    <span className={styles.greeting}>Xin chào, {user.fullName}</span>
    <Button variant="ghost" onClick={handleLogout}>
      Đăng xuất
    </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Đăng nhập
                </Button>
                <Button onClick={() => navigate("/register")}>Đăng ký</Button>
              </>
            )}
          </div>
        </nav>

        <button
          className={styles.menuToggle}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Mở menu điều hướng"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}