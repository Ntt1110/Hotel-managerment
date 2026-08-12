import { useEffect, useState } from "react";
import LocationMap from "../sections/LocationMap";
import { hotelInfoApi } from "../../services/api";
import styles from "./Footer.module.css";

export default function Footer() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    hotelInfoApi.get().then(setInfo).catch(() => {});
  }, []);

  const address = info?.address || "Số 12, đường Ven Biển, Hải Phòng";
  const phone = info?.phone || "0225 123 4567";
  const email = info?.email || "contact@granhaidang.vn";

  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.inner}>
        <div>
          <div className={styles.brand}>Grand Hải Đăng Hotel</div>
          <p className={styles.desc}>{address}</p>

          {info?.location?.lat && (
            <div className={styles.mapWrap}>
              <LocationMap
                lat={info.location.lat}
                lng={info.location.lng}
                name={info.name}
                address={info.address}
              />
            </div>
          )}
        </div>

        <div>
          <div className={styles.colTitle}>Liên hệ</div>
          <p className={styles.line}>Điện thoại: {phone}</p>
          <p className={styles.line}>Email: {email}</p>
        </div>

        <div>
          <div className={styles.colTitle}>Liên kết</div>
          <p className={styles.line}>Chính sách đặt phòng</p>
          <p className={styles.line}>Điều khoản sử dụng</p>
        </div>
      </div>

      <div className={styles.bottom}>© 2026 Grand Hải Đăng Hotel</div>
    </footer>
  );
}