import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsIn, IsNotEmpty, IsString, Length } from "class-validator";
import { $Enums } from "~gen-prisma/index";

export class SignUpUserDto {
	@ApiProperty({
		name: "firstName",
		example: "Juan",
	})
	@IsNotEmpty({
		message: "El nombre es requerido",
	})
	@IsString({
		message: "El nombre debe ser una cadena de texto",
	})
	@Length(1, 50, {
		message: "El nombre debe tener entre 1 y 50 caracteres",
	})
	firstName: string;
	@ApiProperty({
		name: "lastName",
		example: "Juan",
	})
	@IsNotEmpty({
		message: "El apellido es requerido",
	})
	@IsString({
		message: "El apellido debe ser una cadena de texto",
	})
	@Length(1, 50, {
		message: "El apellido debe tener entre 1 y 50 caracteres",
	})
	lastName: string;

	@ApiProperty({
		name: "email",
		format: "email",
		example: "juan@example.com",
	})
	@IsNotEmpty({
		message: "El email es requerido",
	})
	@IsString({
		message: "El email debe ser una cadena de texto",
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

	@ApiProperty({
		enumName: "UserRole",
		enum: $Enums.UserRole,
		default: $Enums.UserRole.seller,
	})
	@IsNotEmpty({
		message: "El rol es requerido",
	})
	@IsIn(["admin", "seller", "customer"], {
		message:
			"El rol debe ser uno de los siguientes: " +
			Object.values($Enums.UserRole).join(", "),
	})
	role: $Enums.UserRole;
}
