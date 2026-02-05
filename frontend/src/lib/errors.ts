export class ApiError extends Error {
  public status: number;
  public code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isValidation(): boolean {
    return this.status === 422;
  }

  get isServer(): boolean {
    return this.status >= 500;
  }
}

export class NetworkError extends Error {
  constructor(message = 'Connection error. Check your internet.') {
    super(message);
    this.name = 'NetworkError';
  }
}
