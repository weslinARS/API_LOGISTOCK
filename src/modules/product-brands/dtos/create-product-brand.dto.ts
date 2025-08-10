import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateProductBrandDto {
	@ApiProperty({
		name: "name",
		description: "Name of the product brand",
		example: "Nike",
		required: true,
	})
	@IsNotEmpty({
		message: "El nombre de la marca del producto es obligatorio",
	})
	@IsString({
		message:
			"El nombre de la marca del producto debe ser una cadena de texto",
	})
	@MinLength(2, {
		message:
			"El nombre de la marca del producto debe tener al menos 2 caracteres",
	})
	name: string;
}
