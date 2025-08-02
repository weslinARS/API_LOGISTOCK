import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ApiResponse, CustomError } from "src/shared/class/api-response.class";
import { PRODUCT_CATEGORY_REPOSITORY_SYMBOL } from "src/shared/common/common-constant";
import { IProductCategoryRepository } from "src/shared/interface/repositories/product-category-repository.interface";
import { CreateProductCategoryDto } from "./dtos/create-product-category.dto";

@Injectable()
export class ProductCategoriesService {
	constructor(
		@Inject(PRODUCT_CATEGORY_REPOSITORY_SYMBOL)
		private readonly productCategoryRepository: IProductCategoryRepository,
	) {}
	async create(data: CreateProductCategoryDto) {
		try {
			const exists =
				await this.productCategoryRepository.verifyIfExistsByName(
					data.name,
				);
			if (exists)
				throw new CustomError({
					errorCode: "RECORD_ALREADY_EXISTS",
					message: "La categoria del producto ya existe",
					statusCode: HttpStatus.CONFLICT,
				});
			const record = await this.productCategoryRepository.create({
				name: data.name,
			});
			if (!record)
				throw new CustomError({
					errorCode: "QUERY_ERROR",
					message: "No se pudo crear la categoria del producto",
					statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				});
			return new ApiResponse({
				message: "Categoria del producto creada exitosamente",
				statusCode: HttpStatus.CREATED,
			});
		} catch (error) {
			if (error instanceof CustomError) throw error.toHttpException();
			throw error;
		}
	}
}
