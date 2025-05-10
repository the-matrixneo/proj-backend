const asynchandler = (reqHandler) => {
  return (err, req, res, next) => {
    Promise.resolve(reqHandler(req, res, next)).catch((err) => next(err));
  };
};
export { asynchandler };
//wrap asynchronous route handlers not repetitive try-catch blocks
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res.status(err.code || 500).json({
//       success: false,
//       message: err.message,
//     });
//   }
