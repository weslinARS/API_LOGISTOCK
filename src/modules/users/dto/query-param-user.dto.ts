import { $Enums } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";
import { QueryParamBaseManyRecords } from "src/shared/class/api-request.class";

export class QueryParamManyUserDto extends QueryParamBaseManyRecords {
	@IsOptional()
	@IsEnum($Enums.UserRole, {
		message: "Invalid user role",
	})
	filter?: string;
}
