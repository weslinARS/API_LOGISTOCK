import {
	Body,
	Controller,
	Get,
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
		const { token, ...userData } = result.data;
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

	@Post("log-out")
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

	@Get("me")
	async getMe(@Cookies("jwt") jwt: string) {
		return this.authService.getMe(jwt);
	}
}
