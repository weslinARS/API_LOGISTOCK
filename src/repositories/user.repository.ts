import { Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "src/modules/prisma/prisma.service";
import {
	findManyUserArgs,
	findOneUserArgs,
	PrismaRepositoryResponse,
	QueryManyWithCount,
} from "src/shared/common/prisma-args";
import { IUserRepository } from "src/shared/interface/repositories/user-repository.interface";

@Injectable()
export class UserRepository implements IUserRepository {
	constructor(private readonly prisma: PrismaService) {}
	async create(data: Prisma.UserCreateInput): Promise<User> {
		return this.prisma.user.create({
			data: data,
		});
	}

	async verifyById(id: string, isDeleted: boolean = false): Promise<boolean> {
		const record = await this.prisma.user.findUnique({
			where: {
				id: id,
				isDeleted: isDeleted,
			},
			select: {
				id: true,
			},
		});
		return !!record;
	}
	async findOneById(
		id: string,
		args?: findOneUserArgs,
	): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: {
				id: id,
				isDeleted: false,
			},
			...(args?.include && !args.select ? { include: args.include } : {}),
			...(args?.select && !args.include
				? {
						select: args.select,
					}
				: {}),
			...(args?.omit
				? {
						omit: args.omit,
					}
				: {}),
		});
	}

	async findOneByEmail(
		email: string,
		args?: findOneUserArgs,
	): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: {
				email: email,
				isDeleted: false,
			},
			...(args?.include && !args.select ? { include: args.include } : {}),
			...(args?.select && !args.include
				? {
						select: args.select,
					}
				: {}),
			...(args?.omit
				? {
						omit: args.omit,
					}
				: {}),
		});
	}

	async verifyByEmail(email: string): Promise<boolean> {
		const user = await this.prisma.user.findUnique({
			where: {
				email: email,
				isDeleted: false,
			},
			select: {
				id: true,
			},
		});
		return !!user;
	}

	async findMany(args: findManyUserArgs): Promise<QueryManyWithCount<User>> {
		const {
			allRecords,
			include,
			includeDeleted,
			isSearchMode,
			pageIndex,
			pageSize,
			select,
			where,
		} = args;

		const baseWhere: Prisma.UserWhereInput = includeDeleted
			? where
				? where
				: {}
			: {
					AND: [
						{
							isDeleted: false,
						},
						...(where ? [where] : []),
					],
				};

		const paginationArgs =
			pageIndex !== undefined &&
			pageSize !== undefined &&
			allRecords == false
				? {
						take: pageSize,
						skip: pageIndex * pageSize,
					}
				: {};
		const findManyArgs: Prisma.UserFindManyArgs = {
			...(include && !select && !isSearchMode
				? {
						include: include,
					}
				: {}),
			...(select && !include && !isSearchMode
				? {
						select: select,
					}
				: {}),
			where: baseWhere,
			omit: {
				password: true,
			},
			...paginationArgs,
		};

		const [records, count] = await Promise.all([
			this.prisma.user.findMany(findManyArgs),
			this.prisma.user.count({
				where: baseWhere,
			}),
		]);

		return {
			count: count,
			records: records,
		};
	}
	async update(
		id: string,
		data: Prisma.UserUpdateInput,
	): Promise<PrismaRepositoryResponse> {
		const result = await this.prisma.user.updateMany({
			where: {
				id: id,
				isDeleted: false,
			},
			data: {
				...data,
				updatedAt: new Date(),
			},
		});

		if (result.count == 0) {
			return {
				success: false,
				data: null,
			};
		}

		return {
			success: true,
			data: id,
		};
	}
	async delete(id: string): Promise<PrismaRepositoryResponse> {
		const result = await this.prisma.user.deleteMany({
			where: {
				id: id,
				isDeleted: false,
			},
		});

		if (result.count == 0) {
			return {
				success: false,
				data: null,
			};
		}
		return {
			success: true,
			data: id,
		};
	}
	async softDelete(id: string): Promise<PrismaRepositoryResponse> {
		const result = await this.prisma.user.updateMany({
			where: {
				id: id,
				isDeleted: false,
			},
			data: {
				isDeleted: true,
				updatedAt: new Date(),
			},
		});

		if (result.count == 0) {
			return {
				success: false,
				data: null,
			};
		}
		return {
			success: true,
			data: id,
		};
	}

	async restore(id: string): Promise<PrismaRepositoryResponse> {
		const result = await this.prisma.user.updateMany({
			where: {
				id: id,
				isDeleted: true,
			},
			data: {
				isDeleted: false,
				updatedAt: new Date(),
			},
		});

		if (result.count == 0) {
			return {
				success: false,
				data: null,
			};
		}
		return {
			success: true,
			data: id,
		};
	}
}
