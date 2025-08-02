import {
	findManyProductArgs,
	findOneProductArgs,
	PrismaRepositoryResponse,
	QueryManyWithCount,
} from "src/shared/common/prisma-args";
import { Prisma, Product } from "~gen-prisma/index";

export interface IProductRepository {
	findOneById(id: string, arg?: findOneProductArgs): Promise<Product | null>;
	findMany(args: findManyProductArgs): Promise<QueryManyWithCount<Product>>;
	create(data: Prisma.ProductCreateInput): Promise<Product>;
	update(
		id: string,
		data: Prisma.ProductUpdateInput,
	): Promise<PrismaRepositoryResponse>;
	delete(id: string): Promise<PrismaRepositoryResponse>;
	softDelete(id: string): Promise<PrismaRepositoryResponse>;
	restore(id: string): Promise<PrismaRepositoryResponse>;
	verifyProductExists(id: string): Promise<boolean>;
	verifyIfExistsByName(name: string): Promise<boolean>;
}
