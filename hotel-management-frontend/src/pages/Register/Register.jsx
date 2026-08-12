import AuthLayout from "../../components/layout/AuthLayout";

export default function Register() {
  return (
    <AuthLayout
      heroTitle="Bắt đầu hành trình lưu trú của bạn."
      heroSubtitle="Tạo tài khoản để đặt phòng nhanh chóng và theo dõi lịch sử lưu trú."
    >
      <div>
        <h2 style={{ fontFamily: "Georgia, serif" }}>Đăng ký</h2>
        <p style={{ color: "#8A8477" }}>
          Form đăng ký sẽ được xây dựng ở bước tiếp theo, tái sử dụng lại
          TextField, Button, AlertBox đã có.
        </p>
      </div>
    </AuthLayout>
  );
}
