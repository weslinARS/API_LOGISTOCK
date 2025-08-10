import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class ParamOneUser {
	@IsNotEmpty({
		message: "El id es requerido",
	})
	@IsString({
		message: "El id debe ser una cadena de texto",
	})
	@IsUUID("4", {
		message: "El id debe ser un UUID v4",
	})
	id: string;
}
