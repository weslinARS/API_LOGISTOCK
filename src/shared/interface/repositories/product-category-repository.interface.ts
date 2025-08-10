import { Prisma, ProductCategory } from "@prisma/client";
import {
	findManyProductCategoryArgs,
	findOneProductCategoryArgs,
	QueryManyWithCount,
} from "src/shared/common/prisma-args";

export interface IProductCategoryRepository {
	create(data: Prisma.ProductCategoryCreateInput): Promise<ProductCategory>;
	findById(id: string): Promise<ProductCategory | null>;
	findByName(name: string): Promise<ProductCategory | null>;
	verifyIfExistsByName(name: string): Promise<boolean>;
	verifyIfExistsById(id: string): Promise<boolean>;
	findMany(
		args: findManyProductCategoryArgs,
	): Promise<QueryManyWithCount<ProductCategory>>;
	findOne(
		id: string,
		args: findOneProductCategoryArgs,
	): Promise<ProductCategory | null>;
}
