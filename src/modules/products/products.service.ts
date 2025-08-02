import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CustomError } from "src/shared/class/api-response.class";
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
			const brandExists =
				await this.productBrandRepository.verifyIfExistsById(
					data.productBrandId,
				);

			if (!brandExists)
				throw new CustomError({
					message: "La marca del producto no existe",
					statusCode: HttpStatus.NOT_FOUND,
					errorCode: "RECORD_NOT_FOUND",
				});
			// verify if category exists

			const categoryExists =
				await this.productCategoryRepository.verifyIfExistsById(
					data.categoryId,
				);

			if (!categoryExists)
				throw new CustomError({
					statusCode: HttpStatus.NOT_FOUND,
					errorCode: "RECORD_NOT_FOUND",
					message: "La categoria del producto no existe",
				});
		} catch (error) {
			if (error instanceof CustomError) throw error.toHttpException();
			throw error;
		}
	}
}
