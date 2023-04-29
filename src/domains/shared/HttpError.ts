import { HttpStatusCode } from "axios"

class HttpError extends Error {
  readonly status?: HttpStatusCode

  constructor({ status, message = "", cause }: { status?: HttpStatusCode; message?: string; cause?: unknown }) {
    super(message)
    super.name = "HttpError"
    super.cause = cause
    this.status = status
  }

  static isHttpError(err: unknown): err is HttpError {
    return err instanceof HttpError
  }
}

export default HttpError
