const express = require("express");
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;


// nạp import của express và các file controller auth, middlewares auth


//cons express = require("express")
//const {register,login.getme} =require("./controller/authcontroller")

//gọi đối tượng router
//const router = express.Router()
//gán hàm cho router

//router.post("/register",register);

//sytan: <đối tượng sử dụng>.<phương thức http>("<URL>",<tên hàm thực thi>)

// xuất đối tượng

//module.exports = router;