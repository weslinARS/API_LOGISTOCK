import {
	findManyUserArgs,
	findOneUserArgs,
	PrismaRepositoryResponse,
} from "src/shared/common/prisma-args";
import { Prisma, User } from "~gen-prisma/index";

export interface IUserRepository {
	findOneById(id: string, args?: findOneUserArgs): Promise<User | null>;
	findMany(args: findManyUserArgs): Promise<User[]>;
	update(
		id: string,
		data: Prisma.UserUpdateInput,
	): Promise<PrismaRepositoryResponse>;
	delete(id: string): Promise<PrismaRepositoryResponse>;
	softDelete(id: string): Promise<PrismaRepositoryResponse>;
}
