import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/prisma.service";
import {
	findManyProductArgs,
	findOneProductArgs,
	PrismaRepositoryResponse,
	QueryManyWithCount,
} from "src/shared/common/prisma-args";
import { IProductRepository } from "src/shared/interface/repositories/product-repository.interface";
import { Prisma, Product } from "~gen-prisma/index";

@Injectable()
export class ProductRepository implements IProductRepository {
	constructor(private readonly prisma: PrismaService) {}
	findOneById(id: string, arg?: findOneProductArgs): Promise<Product | null> {
		throw new Error("Method not implemented.");
	}
	findMany(args: findManyProductArgs): Promise<QueryManyWithCount<Product>> {
		throw new Error("Method not implemented.");
	}
	create(data: Prisma.ProductCreateInput): Promise<Product> {
		throw new Error("Method not implemented.");
	}
	update(
		id: string,
		data: Prisma.ProductUpdateInput,
	): Promise<PrismaRepositoryResponse> {
		throw new Error("Method not implemented.");
	}
	delete(id: string): Promise<PrismaRepositoryResponse> {
		throw new Error("Method not implemented.");
	}
	softDelete(id: string): Promise<PrismaRepositoryResponse> {
		throw new Error("Method not implemented.");
	}
	restore(id: string): Promise<PrismaRepositoryResponse> {
		throw new Error("Method not implemented.");
	}
	verifyProductExists(id: string): Promise<boolean> {
		throw new Error("Method not implemented.");
	}
}
