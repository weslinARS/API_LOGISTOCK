import { Injectable } from "@nestjs/common";
import { Prisma, Product } from "@prisma/client";
import { PrismaService } from "src/modules/prisma/prisma.service";
import {
	findManyProductArgs,
	findOneProductArgs,
	PrismaRepositoryResponse,
	QueryManyWithCount,
} from "src/shared/common/prisma-args";
import { IProductRepository } from "src/shared/interface/repositories/product-repository.interface";

@Injectable()
export class ProductRepository implements IProductRepository {
	constructor(private readonly prisma: PrismaService) {}
	findOneById(id: string, arg?: findOneProductArgs): Promise<Product | null> {
		return this.prisma.product.findUnique({
			where: {
				id,
				isDeleted: false,
			},
			...(arg?.include && !arg.select ? { include: arg.include } : {}),
			...(arg?.select && !arg.include ? { select: arg.select } : {}),
			...(arg?.omit ? { omit: arg.omit } : {}),
		});
	}

	findMany(args: findManyProductArgs): Promise<QueryManyWithCount<Product>> {
		throw new Error("Method not implemented.");
	}
	create(data: Prisma.ProductCreateInput): Promise<Product> {
		return this.prisma.product.create({
			data,
		});
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

	async verifyIfExistsByName(name: string): Promise<boolean> {
		const record = await this.prisma.product.findFirst({
			where: {
				name,
			},
		});
		return !!record;
	}
}
