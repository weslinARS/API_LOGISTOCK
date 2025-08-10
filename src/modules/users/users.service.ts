import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { QueryParamBaseManyRecords } from "src/shared/class/api-request.class";
import { ApiResponse, CustomError } from "src/shared/class/api-response.class";
import { USER_REPOSITORY_SYMBOL } from "src/shared/common/common-constant";
import { IUserRepository } from "src/shared/interface/repositories/user-repository.interface";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
	constructor(
		@Inject(USER_REPOSITORY_SYMBOL)
		private readonly userRepository: IUserRepository,
	) {}

	async findMany(args: QueryParamBaseManyRecords) {
		try {
			const { allRecords, includeDeleted, pageIndex, pageSize } = args;

			const result = await this.userRepository.findMany({
				allRecords,
				includeDeleted,
				pageSize,
				pageIndex,
			});

			return new ApiResponse({
				message: "Users retrieved successfully",
				data: result.records,
				pagination: {
					pageIndex: pageIndex,
					pageSize: pageSize,
					totalPages: Math.ceil(result.count / pageSize),
					totalRecords: result.count,
				},
			});
		} catch (error) {
			console.error("Error in UsersService.findMany:", error);
			if (error instanceof CustomError) throw error.toHttpException();
		}
	}

	async delete(id: string) {
		try {
			// verifiy if user exists
			const exists = await this.userRepository.verifyById(id, false);
			if (!exists)
				throw new CustomError({
					errorCode: "RECORD_NOT_FOUND",
					message: "El usuario a eliminar no existe",
					statusCode: HttpStatus.NOT_FOUND,
				});

			const result = await this.userRepository.delete(id);

			if (!result.success)
				throw new CustomError({
					errorCode: "QUERY_ERROR",
					message: "Error al eliminar el usuario",
					statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				});

			return new ApiResponse({
				statusCode: HttpStatus.OK,
				message: "Usuario eliminado correctamente",
			});
		} catch (error) {
			console.error("Error in UsersService.delete:", error);
			if (error instanceof CustomError) throw error.toHttpException();
			throw new Error("Internal server error");
		}
	}
	async update(id: string, data: UpdateUserDto) {
		try {
			// verifiy if user exists
			const exists = await this.userRepository.verifyById(id, false);
			if (!exists)
				throw new CustomError({
					errorCode: "RECORD_NOT_FOUND",
					message: "El usuario a actualizar no existe",
					statusCode: HttpStatus.NOT_FOUND,
				});

			const result = await this.userRepository.update(id, data);

			if (!result.success)
				throw new CustomError({
					errorCode: "QUERY_ERROR",
					message: "Error al actualizar el usuario",
					statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				});

			return new ApiResponse({
				statusCode: HttpStatus.OK,
				message: "Usuario actualizado correctamente",
			});
		} catch (error) {
			console.error("Error in UsersService.update:", error);
			if (error instanceof CustomError) throw error.toHttpException();
			throw new Error("Internal server error");
		}
	}
	async softDelete(id: string) {
		try {
			// verifiy if user exists
			const exists = await this.userRepository.verifyById(id, false);
			if (!exists)
				throw new CustomError({
					errorCode: "RECORD_NOT_FOUND",
					message: "El usuario a eliminar no existe",
					statusCode: HttpStatus.NOT_FOUND,
				});

			const result = await this.userRepository.softDelete(id);

			if (!result.success)
				throw new CustomError({
					errorCode: "QUERY_ERROR",
					message: "Error al eliminar el usuario",
					statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				});

			return new ApiResponse({
				statusCode: HttpStatus.OK,
				message: "Usuario eliminado correctamente",
			});
		} catch (error) {
			console.error("Error in UsersService.softDelete:", error);
			if (error instanceof CustomError) throw error.toHttpException();
			throw new Error("Internal server error");
		}
	}
	async restore(id: string) {
		try {
			// verifiy if user exists
			const exists = await this.userRepository.verifyById(id, true);
			if (!exists)
				throw new CustomError({
					errorCode: "RECORD_NOT_FOUND",
					message: "El usuario a restaurar no existe",
					statusCode: HttpStatus.NOT_FOUND,
				});

			const result = await this.userRepository.restore(id);

			if (!result.success)
				throw new CustomError({
					errorCode: "QUERY_ERROR",
					message: "Error al restaurar el usuario",
					statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				});

			return new ApiResponse({
				statusCode: HttpStatus.OK,
				message: "Usuario restaurado correctamente",
			});
		} catch (error) {
			console.error("Error in UsersService.restore:", error);
			if (error instanceof CustomError) throw error.toHttpException();
			throw new Error("Internal server error");
		}
	}
}
