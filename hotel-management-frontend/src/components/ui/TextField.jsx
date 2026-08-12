import styles from "./TextField.module.css";

/**
 * Input dung chung toan app, ho tro label, adornment ben phai (vd nut hien/an mat khau).
 */
export default function TextField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  rightAdornment,
  ...rest
}) {
  return (
    <div className={styles.wrap}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          style={rightAdornment ? { paddingRight: 56 } : undefined}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...rest}
        />
        {rightAdornment && (
          <div className={styles.adornment}>{rightAdornment}</div>
        )}
      </div>
    </div>
  );
}
