/**
 * Standardizes API responses
 * @param {Object} res - Express response object
 * @param {string} message - Descriptive message
 * @param {Object|Array} [result={}] - Data payload
 * @param {number} [statusCode=200] - HTTP status code
 */
const sendSuccess = (res, message, result = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    status: true,
    message,
    result,
  });
};

/**
 * Standardizes error responses
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} [statusCode=500] - HTTP status code
 */
const sendError = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({
    status: false,
    message,
  });
};

module.exports = { sendSuccess, sendError };
