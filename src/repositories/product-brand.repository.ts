import { Injectable } from "@nestjs/common";
import { Prisma, ProductBrand } from "@prisma/client";
import { PrismaService } from "src/modules/prisma/prisma.service";
import {
	findManyProductBrandArgs,
	findOneProductBrandArgs,
	QueryManyWithCount,
} from "src/shared/common/prisma-args";
import { IProductBrandRepository } from "src/shared/interface/repositories/product-brand-repository.interface";

@Injectable()
export class ProductBrandRepository implements IProductBrandRepository {
	constructor(private readonly prisma: PrismaService) {}
	async create(data: Prisma.ProductBrandCreateInput): Promise<ProductBrand> {
		return this.prisma.productBrand.create({
			data,
		});
	}
	async findById(
		id: string,
		args: findOneProductBrandArgs,
	): Promise<ProductBrand | null> {
		return this.prisma.productBrand.findUnique({
			where: {
				id,
			},
			...(args.select && !args.include ? { select: args.select } : {}),
			...(args.include && !args.select ? { include: args.include } : {}),
			...(args.omit ? { omit: args.omit } : {}),
		});
	}

	async findByName(name: string): Promise<ProductBrand | null> {
		return this.prisma.productBrand.findFirst({
			where: {
				name,
			},
		});
	}
	async verifyIfExistsByName(name: string): Promise<boolean> {
		const record = await this.prisma.productBrand.findFirst({
			where: {
				name,
			},
		});
		return !!record;
	}

	async verifyIfExistsById(id: string): Promise<boolean> {
		const record = await this.prisma.productBrand.findFirst({
			where: {
				id,
			},
			select: {
				id: true,
			},
		});

		return !!record;
	}
	async findOne(
		id: string,
		args: findOneProductBrandArgs,
	): Promise<ProductBrand | null> {
		return this.prisma.productBrand.findUnique({
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
	async findMany(
		args: findManyProductBrandArgs,
	): Promise<QueryManyWithCount<ProductBrand>> {
		const { allRecords, include, select, pageSize, pageIndex, where } =
			args;
		const baseWhere: Prisma.ProductBrandWhereInput = where ? where : {};
		const paginationArgs =
			allRecords == false &&
			pageIndex !== undefined &&
			pageSize !== undefined
				? {
						skip: pageIndex * pageSize,
						take: pageSize,
					}
				: {};
		const findManyArgs: Prisma.ProductBrandFindManyArgs = {
			...(include && !select ? { include } : {}),
			...(select && !include ? { select } : {}),
			...(args.omit ? { omit: args.omit } : {}),
			where: baseWhere,
			...paginationArgs,
		};

		const [records, count] = await Promise.all([
			await this.prisma.productBrand.findMany({
				...findManyArgs,
			}),
			await this.prisma.productBrand.count({
				where: baseWhere,
			}),
		]);

		return {
			records,
			count,
		};
	}
}
