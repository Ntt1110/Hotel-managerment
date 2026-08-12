// Middleware xu ly khi goi route khong ton tai
const notFound = (req, res, next) => {
  const error = new Error(`Khong tim thay duong dan - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Middleware xu ly loi tap trung
const errorHandler = (err, req, res, next) => {
 const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
