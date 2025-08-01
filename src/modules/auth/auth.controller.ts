import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
	ValidationPipe,
} from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiResponse,
} from "@nestjs/swagger";
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
	async signIn(@Body(new ValidationPipe()) data: SignInUserDto) {
		return this.authService.validateUser(data);
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
}
