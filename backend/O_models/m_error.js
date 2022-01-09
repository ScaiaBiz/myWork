class HttpError extends Error {
	constructor(message, errorCode) {
		super(message, errorCode);
		this.code = errorCode;
		this.message = message;
		this.errorCode = errorCode;
	}
}

module.exports = HttpError;
