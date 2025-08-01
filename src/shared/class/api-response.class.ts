import { HttpException, HttpStatus } from "@nestjs/common";
import { IApiResponse } from "../interface/api-response.interface";
import { IPagination } from "../interface/pagination.interface";

export class ApiResponse<T> implements IApiResponse<T> {
	message: string | string[];
	data?: T | undefined;
	error?: string | undefined;
	meta: Record<string, unknown>;
	statusCode?: HttpStatus | undefined;
	pagination?: IPagination | undefined;

	constructor(
		options: {
			message?: string | string[];
			data?: T;
			error?: string;
			meta?: Record<string, unknown>;
			statusCode?: HttpStatus;
			pagination?: IPagination;
		} = {},
	) {
		this.message = options.message || "Success";
		this.data = options.data;
		this.error = options.error;
		this.meta = options.meta || {};
		this.statusCode = options.statusCode || HttpStatus.OK;
		this.pagination = options.pagination;
	}
}

export type ServiceErrorCode =
	| "VALIDATION_ERROR"
	| "NOT_FOUND"
	| "UNAUTHORIZED"
	| "FORBIDDEN"
	| "INTERNAL_SERVER_ERROR"
	| "CONFLICT"
	| "BAD_REQUEST"
	| "SERVICE_UNAVAILABLE";

export type RepositoryErrorCode =
	| "DATABASE_ERROR"
	| "QUERY_ERROR"
	| "INVALID_PARAMETERS"
	| "RECORD_NOT_FOUND"
	| "DUPLICATE_RECORD"
	| "TRANSACTION_ERROR"
	| "RECORD_ALREADY_EXISTS"
	| "CONNECTION_ERROR";

interface CustomErrorOptions {
	message: string;
	errorCode: ServiceErrorCode | RepositoryErrorCode;
	statusCode?: HttpStatus;
}

export class CustomError extends Error {
	errorCode: ServiceErrorCode | RepositoryErrorCode;
	statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

	constructor({ errorCode, message, statusCode }: CustomErrorOptions) {
		super(message);
		this.name = "CustomError";
		this.errorCode = errorCode;
		this.statusCode = statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

		Error.captureStackTrace(this, this.constructor);
	}

	toHttpException() {
		return new HttpException(
			{
				statusCode: this.statusCode,
				error: this.errorCode,
				message: this.message,
			},
			this.statusCode,
		);
	}
}
