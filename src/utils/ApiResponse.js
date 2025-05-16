class ApiResponse {
  //data return for cookies response
  constructor(statusCode, data, message = "Suvvess") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    this.error = error;
  }
}
export { ApiResponse };
