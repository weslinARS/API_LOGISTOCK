import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CustomError } from "src/shared/class/api-response.class";
import { USER_REPOSITORY_SYMBOL } from "src/shared/common/common-constant";
import { IUserRepository } from "src/shared/interface/repositories/user-repository.interface";

@Injectable()
export class AuthService {
	constructor(
		@Inject(USER_REPOSITORY_SYMBOL)
		private readonly userRepository: IUserRepository,
	) {}

	async findOneById(id: string) {
		try {
			if (!id) {
				throw new CustomError({
					errorCode: "INVALID_PARAMETERS",
					message: "El id es requerido",
					statusCode: HttpStatus.BAD_REQUEST,
				});
			}
			const record = await this.userRepository.findOneById(id, {
				omit: {
					password: true,
				},
			});
			if (!record) {
				throw new CustomError({
					errorCode: "RECORD_NOT_FOUND",
					message: "El usuario no fue encontrado",
					statusCode: HttpStatus.NOT_FOUND,
				});
			}
		} catch (error) {
			if (error instanceof CustomError) throw error.toHttpException();
			throw error;
		}
	}
}
