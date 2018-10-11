class ApiError extends Error {
  constructor (message, status = 500, errorObject = {}) {
    super(message);

    Error.captureStackTrace(this, this.constructor);
    this.name        = this.constructor.name;

    this.status      = status;
    this.errorObject = errorObject;
  }
}

module.exports = ApiError;
