import { Response } from 'express';

interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: any;
}

interface ErrorResponse {
  success: false;
  message: string;
  error: string;
  details: any[];
}

export class ResponseHelper {
  static success<T>(res: Response, data: T, message: string = 'Success', statusCode: number = 200, meta?: any) {
    const response: SuccessResponse<T> = {
      success: true,
      message,
      data,
      meta,
    };
    return res.status(statusCode).json(response);
  }

  static error(res: Response, message: string, error: string = 'Error', statusCode: number = 400, details: any[] = []) {
    const response: ErrorResponse = {
      success: false,
      message,
      error,
      details,
    };
    return res.status(statusCode).json(response);
  }
}
