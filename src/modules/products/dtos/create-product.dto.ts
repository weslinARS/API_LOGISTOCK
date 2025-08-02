import { ApiProperty } from "@nestjs/swagger";
import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
	Length,
	Min,
} from "class-validator";

export class CreateProductDto {
	@ApiProperty({
		name: "name",
		description: "Name of the product",
		type: String,
		example: "Refrigerador",
	})
	@IsNotEmpty({
		message: "El nombre del producto es obligatorio",
	})
	@IsString({
		message: "El nombre del producto debe ser una cadena de texto",
	})
	@Length(2, 100, {
		message: "El nombre del producto debe tener entre 2 y 100 caracteres",
	})
	name: string;
	@ApiProperty({
		name: "categoryName",
		description: "Name of the product category",
		type: String,
		example: "Electronics",
	})
	@IsNotEmpty({
		message: "El nombre de la categoría del producto es obligatorio",
	})
	@IsString({
		message:
			"El nombre de la categoría del producto debe ser una cadena de texto",
	})
	categoryName: string;
	@ApiProperty({
		name: "supplierId",
		description: "ID of the product supplier",
		format: "uuid",
		type: String,
		example: "123e4567-e89b-12d3-a456-426614174001",
	})
	@IsNotEmpty({
		message: "El ID del proveedor del producto es obligatorio",
	})
	@IsString({
		message:
			"El ID del proveedor del producto debe ser una cadena de texto",
	})
	@IsUUID("4", {
		message: "El ID del proveedor del producto debe ser un UUID válido",
	})
	supplierId: string;
	@ApiProperty({
		name: "productBrandName",
		description: "Name of the product brand",
		type: String,
		example: "Samsung",
	})
	@IsNotEmpty({
		message: "El nombre de la marca del producto es obligatorio",
	})
	@IsString({
		message:
			"El nombre de la marca del producto debe ser una cadena de texto",
	})
	productBrandName: string;
	@ApiProperty({
		name: "sku",
		description: "Stock Keeping Unit of the product",
		type: String,
		example: "SKU123456",
	})
	@IsNotEmpty({
		message: "El SKU del producto es obligatorio",
	})
	@IsString({
		message: "El SKU del producto debe ser una cadena de texto",
	})
	@Length(2, 20, {
		message: "El SKU del producto debe tener entre 2 y 20 caracteres",
	})
	sku: string;
	@ApiProperty({
		name: "description",
		description: "Description of the product",
		type: String,
		example: "Refrigerador de alta eficiencia energética.",
		required: false,
	})
	@IsOptional()
	@IsString({
		message: "La descripción del producto debe ser una cadena de texto",
	})
	@Length(0, 500, {
		message:
			"La descripción del producto no puede exceder los 500 caracteres",
	})
	description: string | null;
	@ApiProperty({
		name: "entryPrice",
		description: "Entry price of the product",
		type: Number,
		example: 500.0,
	})
	@IsNotEmpty({
		message: "El precio de entrada del producto es obligatorio",
	})
	@IsNumber(
		{},
		{
			message: "El precio de entrada del producto debe ser un número",
		},
	)
	@Min(0, {
		message:
			"El precio de entrada del producto debe ser un número positivo",
	})
	entryPrice: number;
	@ApiProperty({
		name: "unitPrice",
		description: "Unit price of the product",
		type: Number,
		example: 600.0,
	})
	@IsNotEmpty({
		message: "El precio unitario del producto es obligatorio",
	})
	@IsNumber(
		{},
		{
			message: "El precio unitario del producto debe ser un número",
		},
	)
	@Min(0, {
		message: "El precio unitario del producto debe ser un número positivo",
	})
	unitPrice: number;
}
