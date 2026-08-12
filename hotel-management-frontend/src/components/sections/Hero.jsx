import SearchWidget from "./SearchWidget";
import styles from "./Hero.module.css";

export default function Hero({ onSearch, searching }) {
  return (
    <section className={styles.hero}>
      <div className={styles.dotPattern} aria-hidden="true" />
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Chào mừng đến Grand Thành Trung Hotel</p>
        <h1 className={styles.title}>
          Một chốn dừng chân,
          <br />
          nơi mỗi chiếc chìa khóa kể một câu chuyện.
        </h1>
        <p className={styles.subtitle}>
          Nằm ngay ven biển Hải Phòng, mang phong cách khách sạn boutique cổ
          điển pha nét hiện đại — chọn ngày lưu trú của bạn bên dưới để bắt
          đầu.
        </p>
      </div>

      <div className={styles.searchWrap}>
        <SearchWidget onSearch={onSearch} loading={searching} />
      </div>
    </section>
  );
}