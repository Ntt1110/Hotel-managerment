const HotelInfo = require("../models/HotelInfo");
const { geocodeAddress } = require("../services/geocodingService");

const getHotelInfo = async (req, res, next) => {
  try {
    const info = await HotelInfo.findOne();
    res.status(200).json(info);
  } catch (error) {
    next(error);
  }
};

const updateHotelInfo = async (req, res, next) => {
  try {
    const { name, address, phone, email } = req.body;
    if (!address) {
      return res.status(400).json({ message: "Vui long nhap dia chi" });
    }

    const location = await geocodeAddress(address);

    let info = await HotelInfo.findOne();
    if (info) {
      info.name = name ?? info.name;
      info.address = address;
      info.phone = phone ?? info.phone;
      info.email = email ?? info.email;
      info.location = location;
      await info.save();
    } else {
      info = await HotelInfo.create({ name, address, phone, email, location });
    }

    res.status(200).json(info);
  } catch (error) {
    next(error);
  }
};

module.exports = { getHotelInfo, updateHotelInfo };