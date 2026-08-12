const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @route POST /api/auth/register
// @desc  Dang ky tai khoan (mac dinh la customer, manager tao rieng qua seed hoac admin)
const register = async (req, res, next) => {
  try {
    const { fullName, email, password, phone, address } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Vui long nhap day du thong tin bat buoc" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email da duoc su dung" });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      phone,
      address,
      role: "customer", // dang ky cong khai luon la customer
    });

    return res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/auth/login
// @desc  Dang nhap, dung chung cho ca customer va manager
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Vui long nhap email va mat khau" });
    }

    // can .select("+password") vi model da set select:false mac dinh
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Email hoac mat khau khong dung" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Tai khoan da bi khoa" });
    }

    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/auth/me
// @desc  Lay thong tin ca nhan dang dang nhap
const getMe = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
