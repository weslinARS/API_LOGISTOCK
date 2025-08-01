import { Transform, Type } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";
export class QueryParamBaseOneRecord {
	@IsOptional()
	@Transform(({ value }) => {
		if (Array.isArray(value)) {
			return value.map((v: string) => v.toString());
		}
		if (typeof value === "string") {
			return [value];
		}
		return [];
	})
	include?: string[];

	@IsOptional()
	@Transform(({ value }) => {
		if (Array.isArray(value)) {
			return value.map((v: string) => v.toString());
		}
		if (typeof value === "string") {
			return [value];
		}
		return [];
	})
	count?: string[];
}
export class QueryParamBaseManyRecords {
	@IsOptional()
	@Transform(({ value }) => {
		if (Array.isArray(value)) {
			return value.map((v: string) => v.toString());
		}
		if (typeof value === "string") {
			return [value];
		}
		return [];
	})
	include?: string[];

	@IsOptional()
	@Transform(({ value }) => {
		if (Array.isArray(value)) {
			return value.map((v: string) => v.toString());
		}
		if (typeof value === "string") {
			return [value];
		}
		return [];
	})
	count?: string[];
	@IsOptional()
	@IsBoolean({
		message: "includeDeleted debe ser un valor booleano",
	})
	@Transform(({ value }) => value === "true" || value === true)
	allRecords: boolean = false;
	@IsOptional()
	@Type(() => Number)
	@Transform(({ value }) => {
		if (isNaN(value)) {
			return 0;
		}
		return parseInt(value);
	})
	pageIndex: number = 0;
	@IsOptional()
	@Type(() => Number)
	@Transform(({ value }) => {
		if (isNaN(value)) {
			return 10;
		}
		return parseInt(value);
	})
	pageSize: number = 10;
	@IsOptional()
	@IsBoolean({
		message: "isSearchMode debe ser un valor booleano",
	})
	@Transform(({ value }) => value === "true" || value === true)
	isSearchMode: boolean = false;

	@IsOptional()
	@IsBoolean({
		message: "includeDeleted debe ser un valor booleano",
	})
	@Transform(({ value }) => value === "true" || value === true)
	includeDeleted: boolean = false;
}
