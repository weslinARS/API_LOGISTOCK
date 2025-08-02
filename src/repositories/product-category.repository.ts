import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/prisma.service";
import {
	findManyProductCategoryArgs,
	findOneProductCategoryArgs,
	QueryManyWithCount,
} from "src/shared/common/prisma-args";
import { IProductCategoryRepository } from "src/shared/interface/repositories/product-category-repository.interface";
import { Prisma, ProductCategory } from "~gen-prisma/index";

@Injectable()
export class ProductCategoryRepository implements IProductCategoryRepository {
	constructor(private readonly prisma: PrismaService) {}
	async create(
		data: Prisma.ProductCategoryCreateInput,
	): Promise<ProductCategory> {
		return this.prisma.productCategory.create({
			data,
		});
	}

	async findById(id: string): Promise<ProductCategory | null> {
		return this.prisma.productCategory.findUnique({
			where: {
				id,
			},
		});
	}

	async findMany(
		args: findManyProductCategoryArgs,
	): Promise<QueryManyWithCount<ProductCategory>> {
		const { allRecords, include, select, pageSize, pageIndex, where } =
			args;
		const baseWhere: Prisma.ProductCategoryWhereInput = where ? where : {};
		const paginationArgs =
			allRecords == false &&
			pageIndex !== undefined &&
			pageSize !== undefined
				? {
						skip: pageIndex * pageSize,
						take: pageSize,
					}
				: {};
		const findManyArgs: Prisma.ProductCategoryFindManyArgs = {
			...(include && !select ? { include } : {}),
			...(select && !include ? { select } : {}),
			...(args.omit ? { omit: args.omit } : {}),
			where: baseWhere,
			...paginationArgs,
		};

		const [records, count] = await Promise.all([
			await this.prisma.productCategory.findMany({
				...findManyArgs,
			}),
			await this.prisma.productCategory.count({
				where: baseWhere,
			}),
		]);

		return {
			records,
			count,
		};
	}

	async findOne(
		id: string,
		args: findOneProductCategoryArgs,
	): Promise<ProductCategory | null> {
		return this.prisma.productCategory.findUnique({
			where: {
				id,
			},
			...(args.select && !args.include
				? {
						select: args.select,
					}
				: {}),
			...(args.include && !args.select
				? {
						include: args.include,
					}
				: {}),
		});
	}

	async verifyIfExistsByName(name: string): Promise<boolean> {
		const record = await this.prisma.productCategory.findFirst({
			where: {
				name,
			},
		});

		return !!record;
	}

	async verifyIfExistsById(id: string): Promise<boolean> {
		const record = await this.prisma.productCategory.findFirst({
			where: {
				id,
			},
			select: {
				id: true,
			},
		});

		return !!record;
	}
}
