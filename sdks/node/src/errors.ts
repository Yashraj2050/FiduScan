
export class FiduScanError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class APIError extends FiduScanError {
  constructor(message: string, public statusCode?: number, public payload?: any) {
    super(message);
  }
}

export class AuthenticationError extends APIError {}
export class ValidationError extends APIError {}
export class RateLimitError extends APIError {}
