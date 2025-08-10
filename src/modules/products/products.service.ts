import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ApiResponse, CustomError } from "src/shared/class/api-response.class";
import {
	PRODUCT_BRAND_REPOSITORY_SYMBOL,
	PRODUCT_CATEGORY_REPOSITORY_SYMBOL,
	Product_REPOSITORY_SYMBOL,
} from "src/shared/common/common-constant";
import { IProductBrandRepository } from "src/shared/interface/repositories/product-brand-repository.interface";
import { IProductCategoryRepository } from "src/shared/interface/repositories/product-category-repository.interface";
import { IProductRepository } from "src/shared/interface/repositories/product-repository.interface";
import { CreateProductDto } from "./dtos/create-product.dto";

@Injectable()
export class ProductsService {
	constructor(
		@Inject(Product_REPOSITORY_SYMBOL)
		private readonly productRepository: IProductRepository,
		@Inject(PRODUCT_BRAND_REPOSITORY_SYMBOL)
		private readonly productBrandRepository: IProductBrandRepository,
		@Inject(PRODUCT_CATEGORY_REPOSITORY_SYMBOL)
		private readonly productCategoryRepository: IProductCategoryRepository,
	) {}

	async createProduct(data: CreateProductDto) {
		try {
			// verify if product exists
			const productExists =
				await this.productRepository.verifyIfExistsByName(data.name);
			if (productExists)
				throw new CustomError({
					message: "El producto ya existe",
					statusCode: HttpStatus.CONFLICT,
					errorCode: "RECORD_ALREADY_EXISTS",
				});
			// verify if brand exists

			let brand = await this.productBrandRepository.findByName(
				data.productBrandName,
			);
			if (!brand) {
				// create brand if not exists
				brand = await this.productBrandRepository.create({
					name: data.productBrandName,
				});

				if (!brand)
					throw new CustomError({
						statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
						errorCode: "INTERNAL_SERVER_ERROR",
						message: "Error al crear la marca del producto",
					});
			}

			const category = await this.productCategoryRepository.findByName(
				data.categoryName,
			);

			if (!category)
				throw new CustomError({
					statusCode: HttpStatus.NOT_FOUND,
					errorCode: "RECORD_NOT_FOUND",
					message: "La categoria del producto no existe",
				});

			// create product
			const product = await this.productRepository.create({
				name: data.name,
				category: {
					connect: {
						id: category.id,
					},
				},
				entryPrice: data.entryPrice,
				sku: data.sku,
				unitPrice: data.unitPrice,
				supplier: {
					connect: {
						id: data.supplierId,
					},
				},
				description: data.description,
				productBrand: {
					connect: {
						id: brand.id,
					},
				},
			});

			return new ApiResponse({
				statusCode: HttpStatus.CREATED,
				message: "Producto creado correctamente",
				data: product,
			});
		} catch (error) {
			if (error instanceof CustomError) throw error.toHttpException();
			throw error;
		}
	}
}
