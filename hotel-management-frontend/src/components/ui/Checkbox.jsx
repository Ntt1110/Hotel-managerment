import styles from "./Checkbox.module.css";

export default function Checkbox({ label, checked, onChange }) {
  return (
    <label className={styles.wrap}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}
