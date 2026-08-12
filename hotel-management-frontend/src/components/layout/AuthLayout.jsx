import KeyIllustration from "./KeyIllustration";
import styles from "./AuthLayout.module.css";

/**
 * Khung layout dung chung cho cac trang xac thuc (Login, Register, QuenMatKhau).
 * Panel trai: thuong hieu + minh hoa (an tren mobile).
 * Panel phai: slot chua form, truyen qua children.
 *
 * props:
 *  - heroTitle: tieu de lon ben panel trai
 *  - heroSubtitle: mo ta ngan
 *  - children: noi dung form ben phai
 */
export default function AuthLayout({ heroTitle, heroSubtitle, children }) {
  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <div className={styles.dotPattern} aria-hidden="true" />
        <div className={styles.brandMark}>Grand Thành Trung Hotel</div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{heroTitle}</h1>
          <p className={styles.heroSubtitle}>{heroSubtitle}</p>
          <div className={styles.illustrationWrap}>
            <KeyIllustration />
          </div>
        </div>
        <div className={styles.footNote}>© 2026 Grand Thành Trung Hotel</div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formSlot}>{children}</div>
      </div>
    </div>
  );
}
