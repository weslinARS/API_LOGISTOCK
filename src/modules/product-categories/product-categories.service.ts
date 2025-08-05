import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { QueryParamBaseManyRecords } from "src/shared/class/api-request.class";
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
	async findMany(queryParams: QueryParamBaseManyRecords) {
		try {
			const {
				allRecords,
				includeDeleted,
				isSearchMode,
				pageIndex,
				pageSize,
				count,
				include,
			} = queryParams;
			const response = await this.productCategoryRepository.findMany({
				includeDeleted: includeDeleted ?? false,
				isSearchMode: isSearchMode ?? false,
				pageIndex: pageIndex,
				pageSize: pageSize,
				allRecords: allRecords ?? false,
				...(include || count
					? {
							include: {
								Product: include?.includes("Product"),
								...(count
									? {
											_count: {
												select: {
													Product:
														count.includes(
															"Product",
														) ?? false,
												},
											},
										}
									: {}),
							},
						}
					: {}),
			});

			return new ApiResponse({
				data: response.records,
				message: "Categorias de productos obtenidas exitosamente",
				pagination: {
					pageIndex: pageIndex,
					pageSize: pageSize,
					totalPages: Math.floor(response.count / pageSize),
					totalRecords: response.count,
				},
			});
		} catch (error) {
			if (error instanceof CustomError) throw error.toHttpException();
			throw error;
		}
	}
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
