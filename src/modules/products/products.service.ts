import { Inject, Injectable } from "@nestjs/common";
import { Product_REPOSITORY_SYMBOL } from "src/shared/common/common-constant";
import { IProductRepository } from "src/shared/interface/repositories/product-repository.interface";

@Injectable()
export class ProductsService {
	constructor(
		@Inject(Product_REPOSITORY_SYMBOL)
		private readonly productRepository: IProductRepository,
	) {}
}
