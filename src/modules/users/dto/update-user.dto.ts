import { $Enums } from "@prisma/client";
import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
	@IsOptional()
	@IsString({
		message: "El nombre es un campo de texto",
	})
	firstName?: string;

	@IsOptional()
	@IsString({
		message: "El apellido es un campo de texto",
	})
	lastName?: string;

	@IsOptional()
	@IsEnum($Enums.UserRole, {
		message: "El rol debe ser uno de los valores permitidos",
	})
	role?: $Enums.UserRole;

	@IsOptional()
	@IsEmail(
		{},
		{
			message:
				"El correo electrónico debe ser un correo electrónico válido",
		},
	)
	email?: string;

	@IsOptional()
	@IsString({
		message: "La contraseña es un campo de texto",
	})
	password?: string;
}
