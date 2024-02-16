class ApiError extends Error {
    constructor(
        statusCode,
        messages,
    ) {
        super(messages)
        this.statusCode = statusCode
        this.messages = messages
        this.success = false
    }
}

export { ApiError }