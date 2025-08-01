import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/prisma.service";
import {
	findManyUserArgs,
	findOneUserArgs,
	PrismaRepositoryResponse,
} from "src/shared/common/prisma-args";
import { IUserRepository } from "src/shared/interface/repositories/user-repository.interface";
import { Prisma, User } from "~gen-prisma/index";

@Injectable()
export class UserRepository implements IUserRepository {
	constructor(private readonly prisma: PrismaService) {}
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
	findMany(args: findManyUserArgs): Promise<User[]> {
		throw new Error("Method not implemented.");
	}
	update(
		id: string,
		data: Prisma.UserUpdateInput,
	): Promise<PrismaRepositoryResponse> {
		throw new Error("Method not implemented.");
	}
	delete(id: string): Promise<PrismaRepositoryResponse> {
		throw new Error("Method not implemented.");
	}
	softDelete(id: string): Promise<PrismaRepositoryResponse> {
		throw new Error("Method not implemented.");
	}
}
