import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import * as dayjs from "dayjs";
import { ApiResponse, CustomError } from "src/shared/class/api-response.class";
import { USER_REPOSITORY_SYMBOL } from "src/shared/common/common-constant";
import { JwtClaim } from "src/shared/interface/jwt-claim.interface";
import { IUserRepository } from "src/shared/interface/repositories/user-repository.interface";
import { PdfGenerationService } from "../pdf/pdf-generation.service";
import { SignInUserDto } from "./dtos/sign-in-user.dto";
import { SignUpUserDto } from "./dtos/sign-up-user.dto";
@Injectable()
export class AuthService {
	constructor(
		@Inject(USER_REPOSITORY_SYMBOL)
		private readonly userRepository: IUserRepository,
		private readonly jwtService: JwtService,
		private readonly pdfGenerationService: PdfGenerationService,
	) {}

	async getMe(jwt: string) {
		if (jwt == undefined || jwt == null || jwt === "") {
			throw new CustomError({
				errorCode: "UNAUTHORIZED",
				message: "No token provided",
				statusCode: HttpStatus.UNAUTHORIZED,
			});
		}

		const payload = await this.verifyToken(jwt);

		if (!payload) {
			throw new CustomError({
				errorCode: "UNAUTHORIZED",
				message: "Invalid token",
				statusCode: HttpStatus.UNAUTHORIZED,
			});
		}

		try {
			const record = await this.userRepository.findOneById(payload.id, {
				omit: {
					password: true,
					createdAt: true,
					isDeleted: true,
				},
			});

			if (!record)
				throw new CustomError({
					errorCode: "NOT_FOUND",
					message: "Usuario no encontrado",
					statusCode: HttpStatus.NOT_FOUND,
				});

			return new ApiResponse({
				data: record,
				message: "Usuario encontrado",
				statusCode: HttpStatus.OK,
			});
		} catch (error) {
			if (error instanceof CustomError) return error.toHttpException();
			throw error;
		}
	}
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

			// Return user data without password for PDF generation
			const userData = {
				id: record.id,
				firstName: record.firstName,
				lastName: record.lastName,
				email: record.email,
				role: record.role,
				createdAt: record.createdAt,
				password: data.password,
			};

			return new ApiResponse({
				data: userData,
				message: "Usuario creado exitosamente",
				statusCode: HttpStatus.CREATED,
			});
		} catch (error) {
			if (error instanceof CustomError) throw error.toHttpException();
			throw error;
		}
	}

	async generateUserPdf(userData: any): Promise<Buffer> {
		try {
			// Reset the PDF service for a new document
			this.pdfGenerationService.reset();

			// Create a new PDF document
			this.pdfGenerationService.createDocument({
				title: "User Registration Report",
				format: "letter",
			});

			// Add header
			this.pdfGenerationService.addHeader("LogiStock", 1, "center");
			this.pdfGenerationService.addHeader(
				"Reporte de Usuario Registrado",
				2,
				"center",
			);

			// Add user information section

			this.pdfGenerationService.addText("Nombre completo:", {
				fontStyle: "bold",
			});
			this.pdfGenerationService.addText(
				`${userData.firstName} ${userData.lastName}`,
			);
			this.pdfGenerationService.addText("Correo Electrónico:", {
				fontStyle: "bold",
			});
			this.pdfGenerationService.addText(userData.email, {
				fontStyle: "normal",
			});
			this.pdfGenerationService.addText("Contraseña:", {
				fontStyle: "bold",
			});
			this.pdfGenerationService.addText(userData.password, {
				fontStyle: "normal",
			});
			this.pdfGenerationService.addText("Rol:", {
				fontStyle: "bold",
			});
			this.pdfGenerationService.addText(userData.role, {
				fontStyle: "normal",
			});
			this.pdfGenerationService.addText("Fecha de Registro:", {
				fontStyle: "bold",
			});
			this.pdfGenerationService.addText(
				dayjs(userData.createdAt).format("DD-MM-YYYY"),
				{
					fontStyle: "normal",
				},
			);

			// Add footer
			this.pdfGenerationService.addFooter(
				"Pag. {pageNumber} - LogiStock",
				{
					fontSize: 8,
					fontStyle: "normal",
					color: "#666666",
					align: "center",
				},
			);

			// Export as buffer
			return this.pdfGenerationService.exportAsBuffer();
		} catch (error) {
			throw new CustomError({
				errorCode: "INTERNAL_SERVER_ERROR",
				message: `Error al generar PDF: ${error.message}`,
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			});
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
