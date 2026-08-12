import AuthLayout from "../components/layout/AuthLayout";

export default function ForgotPassword() {
  return (
    <AuthLayout
      heroTitle="Chúng tôi sẽ giúp bạn lấy lại quyền truy cập."
      heroSubtitle="Nhập email đã đăng ký để nhận hướng dẫn đặt lại mật khẩu."
    >
      <div>
        <h2 style={{ fontFamily: "Georgia, serif" }}>Quên mật khẩu</h2>
        <p style={{ color: "#8A8477" }}>Form sẽ được xây dựng ở bước tiếp theo.</p>
      </div>
    </AuthLayout>
  );
}
