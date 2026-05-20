import type { ApiErrorDto } from "../dtos";

export class AppError extends Error {
  readonly statusCode: number;
  readonly field?: string;

  constructor(statusCode: number, message: string, field?: string) {
    super(message);
    this.statusCode = statusCode;
    this.field = field;
    this.name = "AppError";
  }

  toJSON(): ApiErrorDto {
    return {
      statusCode: this.statusCode,
      message: this.message,
      ...(this.field ? { field: this.field } : {}),
    };
  }
}
