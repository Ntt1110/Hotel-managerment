const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ["customer", "manager"],
      default: "customer",
    },
    address: { type: String, trim: true },
    avatarUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true } // tu tao createdAt, updatedAt
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });

// Hash mat khau truoc khi luu
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// So sanh mat khau khi dang nhap
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
