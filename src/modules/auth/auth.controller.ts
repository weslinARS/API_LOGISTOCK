import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Request,
	Res,
	UseGuards,
	ValidationPipe,
} from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiResponse,
} from "@nestjs/swagger";
import { Response } from "express";
import { ApiResponse as APIResponse } from "src/shared/class/api-response.class";
import { Cookies } from "src/shared/decorator/cookie/cookie.decorator";
import { Roles } from "src/shared/decorators/roles/roles.decorator";
import { ROLES } from "src/shared/enums/roles.enum";
import { PoliceGuard } from "src/shared/guards/police/police.guard";
import { AuthService } from "./auth.service";
import { SignInUserDto } from "./dtos/sign-in-user.dto";
import { SignUpUserDto } from "./dtos/sign-up-user.dto";
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("sign-in")
	@ApiOperation({
		summary: "Sign in a user",
		description: "Endpoint to sign in a user with email and password.",
	})
	@ApiBody({
		type: SignInUserDto,
		required: true,
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "User signed in successfully.",
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: "Invalid credentials.",
	})
	@HttpCode(HttpStatus.OK)
	async signIn(
		@Body(new ValidationPipe()) data: SignInUserDto,
		@Res() response: Response,
	) {
		const result = await this.authService.validateUser(data);
		const { token, user: userData } = result.data;
		// attach a cookie
		response.cookie("jwt", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 24 * 60 * 60 * 1000,
		});

		response.send(
			new APIResponse({
				data: {
					...userData,
				},
				message: "Usuario autenticado correctamente",
				statusCode: HttpStatus.OK,
			}),
		);
	}

	@Post("sign-up")
	@ApiBearerAuth()
	@ApiOperation({
		summary: "Sign up a new user",
		description: "Endpoint to sign up a new user with email and password.",
	})
	@ApiBody({
		type: SignUpUserDto,
		required: true,
	})
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: "User signed up successfully.",
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: "Invalid input data.",
	})
	@Roles([ROLES.ADMIN])
	@UseGuards(PoliceGuard)
	@HttpCode(HttpStatus.CREATED)
	async signUp(@Body(new ValidationPipe()) data: SignUpUserDto) {
		return this.authService.signUp(data);
	}

	@Post("sign-up-pdf")
	@ApiBearerAuth()
	@ApiOperation({
		summary: "Sign up a new user and generate PDF report",
		description:
			"Endpoint to sign up a new user and receive a PDF report with user data.",
	})
	@ApiBody({
		type: SignUpUserDto,
		required: true,
	})
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: "User signed up successfully and PDF generated.",
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: "Invalid input data.",
	})
	@Roles([ROLES.ADMIN])
	@UseGuards(PoliceGuard)
	@HttpCode(HttpStatus.CREATED)
	async signUpWithPdf(
		@Body(new ValidationPipe()) data: SignUpUserDto,
		@Res() response: Response,
	) {
		const result = await this.authService.signUp(data);
		if (result.data) {
			const pdfBuffer = await this.authService.generateUserPdf(
				result.data,
			);

			response.setHeader("Content-Type", "application/pdf");
			response.setHeader(
				"Content-Disposition",
				`attachment; filename="usuario-${result.data.firstName}-${result.data.lastName}.pdf"`,
			);
			response.setHeader("Content-Length", pdfBuffer.length);

			response.send(pdfBuffer);
		} else {
			response.json(
				new APIResponse({
					message: "Usuario creado correctamente",
					statusCode: HttpStatus.CREATED,
				}),
			);
		}
	}

	@Post("sign-out")
	async logOut(
		@Request() req: Request,
		@Res({
			passthrough: true,
		})
		res: Response,
	) {
		res.clearCookie("jwt");
		res.json(
			new APIResponse({
				message: "Sesión cerrada correctamente",
				statusCode: HttpStatus.OK,
			}),
		);
	}

	@Post("me")
	@HttpCode(HttpStatus.OK)
	async getMe(@Cookies("jwt") jwt: string) {
		return this.authService.getMe(jwt);
	}
}
