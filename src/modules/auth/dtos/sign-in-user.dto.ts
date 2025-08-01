import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, IsString } from "class-validator";

export class SignInUserDto {
	@ApiProperty({
		name: "email",
		example: "user@example.com",
	})
	@IsNotEmpty({
		message: "El email es requerido",
	})
	@IsEmail(
		{},
		{
			message: "El email no es válido",
		},
	)
	email: string;
	@ApiProperty({
		name: "password",
		example: "password123",
	})
	@IsNotEmpty({
		message: "La contraseña es requerida",
	})
	@IsString({
		message: "La contraseña debe ser una cadena de texto",
	})
	password: string;
}
