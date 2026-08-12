import styles from "./RoleTabs.module.css";

/**
 * Tab chon vai tro, dung o man hinh dang nhap/dang ky.
 * options: [{ value: "customer", label: "Khach hang" }, ...]
 */
export default function RoleTabs({ options, value, onChange }) {
  return (
    <div className={styles.tabRow} role="tablist">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={value === opt.value}
          className={`${styles.tabBtn} ${value === opt.value ? styles.active : ""}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
