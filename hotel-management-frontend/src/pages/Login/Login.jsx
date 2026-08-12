import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import RoleTabs from "../../components/ui/RoleTabs";
import TextField from "../../components/ui/TextField";
import TextButton from "../../components/ui/TextButton";
import Checkbox from "../../components/ui/Checkbox";
import Button from "../../components/ui/Button";
import AlertBox from "../../components/ui/AlertBox";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Login.module.css";

const ROLE_OPTIONS = [
  { value: "customer", label: "Khách hàng" },
  { value: "manager", label: "Quản lý" },
];
const ROLE_LABEL = { customer: "Khách hàng", manager: "Quản lý" };

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      const userInfo = await login(email, password, remember);

      if (userInfo.role !== role) {
        setError(
          `Tài khoản này thuộc vai trò "${ROLE_LABEL[userInfo.role]}", không khớp với lựa chọn "${ROLE_LABEL[role]}".`
        );
        return;
      }

      navigate(role === "manager" ? "/manager/dashboard" : "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      heroTitle="Cánh cửa hệ thống mở ra trải nghiệm lưu trú."
      heroSubtitle="Đăng nhập để đặt phòng, quản lý lịch lưu trú, hoặc điều phối vận hành khách sạn — tất cả trong một nơi."
    >
      <form onSubmit={handleSubmit}>
        <h2 className={styles.title}>Đăng nhập</h2>
        <p className={styles.subtitle}>
          Chọn vai trò và nhập thông tin tài khoản của bạn.
        </p>

        <RoleTabs options={ROLE_OPTIONS} value={role} onChange={setRole} />

        <AlertBox variant="error">{error}</AlertBox>

        <TextField
          label="Email"
          type="email"
          placeholder="ban@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <TextField
          label="Mật khẩu"
          type={showPassword ? "text" : "password"}
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          rightAdornment={
            <TextButton onClick={() => setShowPassword((v) => !v)}>
              {showPassword ? "Ẩn" : "Hiện"}
            </TextButton>
          }
        />

        <div className={styles.rowBetween}>
          <Checkbox
            label="Ghi nhớ đăng nhập"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <Link to="/forgot-password" className={styles.link}>
            Quên mật khẩu?
          </Link>
        </div>

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>

        <p className={styles.bottomText}>
          Chưa có tài khoản?{" "}
          <Link to="/register" className={styles.link}>
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
