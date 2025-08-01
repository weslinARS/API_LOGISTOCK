import { HttpStatus } from "@nestjs/common";
import { IPagination } from "./pagination.interface";

export interface IApiResponse<T> {
	message: string | string[];
	data?: T;
	error?: string;
	meta: Record<string, unknown>;
	statusCode?: HttpStatus;
	pagination?: IPagination;
}
