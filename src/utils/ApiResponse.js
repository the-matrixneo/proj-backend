class ApiResponse {
  constructor(statusCode, data, message = "Suvvess") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    this.error = error;
  }
}
