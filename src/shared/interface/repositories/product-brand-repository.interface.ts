import {
	findManyProductBrandArgs,
	findOneProductBrandArgs,
	QueryManyWithCount,
} from "src/shared/common/prisma-args";
import { Prisma, ProductBrand } from "~gen-prisma/index";

export interface IProductBrandRepository {
	create(data: Prisma.ProductBrandCreateInput): Promise<ProductBrand>;
	findById(
		id: string,
		args: findOneProductBrandArgs,
	): Promise<ProductBrand | null>;
	findByName(name: string): Promise<ProductBrand | null>;
	verifyIfExistsByName(name: string): Promise<boolean>;
	verifyIfExistsById(id: string): Promise<boolean>;
	findMany(
		args: findManyProductBrandArgs,
	): Promise<QueryManyWithCount<ProductBrand>>;
	findOne(
		id: string,
		args: findOneProductBrandArgs,
	): Promise<ProductBrand | null>;
}
