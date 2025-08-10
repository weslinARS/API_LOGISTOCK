import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateProductCategoryDto {
	@ApiProperty({
		name: "name",
		description: "Name of the product category",
		example: "Electronics",
		required: true,
	})
	@IsNotEmpty({
		message: "El nombre de la categoria del producto es obligatorio",
	})
	@IsString({
		message:
			"El nombre de la categoria del producto debe ser una cadena de texto",
	})
	@MinLength(2, {
		message:
			"El nombre de la categoria del producto debe tener al menos 2 caracteres",
	})
	name: string;
}
