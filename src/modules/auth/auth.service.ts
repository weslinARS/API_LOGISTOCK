import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { ApiResponse, CustomError } from "src/shared/class/api-response.class";
import { USER_REPOSITORY_SYMBOL } from "src/shared/common/common-constant";
import { JwtClaim } from "src/shared/interface/jwt-claim.interface";
import { IUserRepository } from "src/shared/interface/repositories/user-repository.interface";
import { SignInUserDto } from "./dtos/sign-in-user.dto";
import { SignUpUserDto } from "./dtos/sign-up-user.dto";
@Injectable()
export class AuthService {
	constructor(
		@Inject(USER_REPOSITORY_SYMBOL)
		private readonly userRepository: IUserRepository,
		private readonly jwtService: JwtService,
	) {}

	async signUp(data: SignUpUserDto) {
		try {
			const exist = await this.userRepository.verifyByEmail(data.email);
			if (exist)
				throw new CustomError({
					errorCode: "RECORD_ALREADY_EXISTS",
					message: "El usuario ya existe",
					statusCode: HttpStatus.CONFLICT,
				});
			// generate hash
			const hashedPassword = await this.hashPassword(data.password);
			// create user
			const record = await this.userRepository.create({
				email: data.email,
				firstName: data.firstName,
				password: hashedPassword,
				lastName: data.lastName,
				role: data.role,
			});

			if (!record)
				throw new CustomError({
					errorCode: "INTERNAL_SERVER_ERROR",
					message: "Error al crear el usuario",
					statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				});

			return new ApiResponse({
				message: "Usuario creado exitosamente",
				statusCode: HttpStatus.CREATED,
			});
		} catch (error) {
			if (error instanceof CustomError) throw error.toHttpException();
			throw error;
		}
	}
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

	async validateUser(data: SignInUserDto) {
		try {
			const record = await this.userRepository.findOneByEmail(data.email);

			if (!record) {
				throw new CustomError({
					errorCode: "RECORD_NOT_FOUND",
					message: "El usuario no fue encontrado",
					statusCode: HttpStatus.NOT_FOUND,
				});
			}

			// validate password

			const isPasswordValid = await bcrypt.compare(
				data.password,
				record.password,
			);
			if (!isPasswordValid)
				throw new CustomError({
					errorCode: "BAD_REQUEST",
					message: "La contraseña es incorrecta",
					statusCode: HttpStatus.BAD_REQUEST,
				});

			// obtener al usuario sin la contraseña

			const claim: JwtClaim = {
				role: record.role,
				id: record.id,
				email: record.email,
			};

			const token = await this.SignClaim(claim);

			return new ApiResponse({
				data: {
					token: token,
					user: {
						id: record.id,
						firstName: record.firstName,
						lastName: record.lastName,
						role: record.role,
						email: record.email,
					},
				},
			});
		} catch (error) {
			if (error instanceof CustomError) throw error.toHttpException();
			throw error;
		}
	}

	private async SignClaim(claim: JwtClaim): Promise<string> {
		return this.jwtService.signAsync(claim, {});
	}

	private async verifyToken(token: string): Promise<JwtClaim> {
		return this.jwtService.verifyAsync(token);
	}

	private async hashPassword(password: string) {
		const salt = await bcrypt.genSalt(10);
		return bcrypt.hash(password, salt);
	}
}
