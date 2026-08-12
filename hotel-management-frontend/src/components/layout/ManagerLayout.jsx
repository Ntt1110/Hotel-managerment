import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./ManagerLayout.module.css";

export default function ManagerLayout({ title, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={styles.wrap}>
      <Sidebar />

      <div className={styles.main}>
        <header className={styles.topbar}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.userBox}>
            <span className={styles.userName}>{user?.fullName}</span>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <LogOut size={16} strokeWidth={1.8} />
              Đăng xuất
            </button>
          </div>
        </header>

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}