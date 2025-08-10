import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Query,
	UseGuards,
	ValidationPipe,
} from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { QueryParamBaseManyRecords } from "src/shared/class/api-request.class";
import { Roles } from "src/shared/decorators/roles/roles.decorator";
import { ROLES } from "src/shared/enums/roles.enum";
import { PoliceGuard } from "src/shared/guards/police/police.guard";
import { ParamOneUser } from "./dto/params-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
@UseGuards(PoliceGuard)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get(":id")
	@ApiOperation({
		summary: "Retrieve a user by ID",
	})
	@Roles([ROLES.ADMIN])
	@HttpCode(HttpStatus.OK)
	async findOne(@Param(new ValidationPipe()) params: ParamOneUser) {
		return this.usersService.findOne(params.id);
	}
	@Get()
	@ApiOperation({
		summary: "Retrieve multiple users paginated",
	})
	@ApiQuery({
		name: "pageIndex",
		required: false,
		type: Number,
	})
	@ApiQuery({
		name: "pageSize",
		required: false,
		type: Number,
	})
	@ApiQuery({
		name: "includeDeleted",
		required: false,
		type: Boolean,
	})
	@Roles([ROLES.ADMIN])
	@HttpCode(HttpStatus.OK)
	async findMany(
		@Query(new ValidationPipe()) queryParams: QueryParamBaseManyRecords,
	) {
		return this.usersService.findMany(queryParams);
	}

	@Patch(":id/restore")
	@ApiOperation({
		summary: "Restore a soft-deleted user",
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "User restored successfully",
	})
	@Roles([ROLES.ADMIN])
	@HttpCode(HttpStatus.OK)
	async restore(@Param(new ValidationPipe()) params: ParamOneUser) {
		return this.usersService.restore(params.id);
	}

	@Patch(":id/soft-delete")
	@ApiOperation({
		summary: "Soft-delete a user",
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "User soft-deleted successfully",
	})
	@Roles([ROLES.ADMIN])
	@HttpCode(HttpStatus.OK)
	async softDelete(@Param(new ValidationPipe()) params: ParamOneUser) {
		return this.usersService.softDelete(params.id);
	}

	@Patch(":id")
	@ApiOperation({
		summary: "Update a user",
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "User updated successfully",
	})
	@Roles([ROLES.ADMIN])
	@HttpCode(HttpStatus.OK)
	async update(
		@Param(new ValidationPipe()) params: ParamOneUser,
		@Body(new ValidationPipe()) body: UpdateUserDto,
	) {
		return this.usersService.update(params.id, body);
	}

	@Delete(":id")
	@ApiOperation({
		summary: "Delete a user",
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "User deleted successfully",
	})
	@Roles([ROLES.ADMIN])
	@HttpCode(HttpStatus.OK)
	async delete(@Param(new ValidationPipe()) params: ParamOneUser) {
		return this.usersService.delete(params.id);
	}
}
