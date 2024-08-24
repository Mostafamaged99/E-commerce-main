export const globalErrorHandler = (err, req, res, next) => {
  let code = err.statusCode || 500;
  return res
    .status(code)
    .json({ Error: "Error", message: err.message, Code: code, Stack: err.stack });
};
