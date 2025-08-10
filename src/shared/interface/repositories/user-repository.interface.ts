import { Prisma, User } from "@prisma/client";
import {
	findManyUserArgs,
	findOneUserArgs,
	PrismaRepositoryResponse,
	QueryManyWithCount,
} from "src/shared/common/prisma-args";

export interface IUserRepository {
	findOneById(id: string, args?: findOneUserArgs): Promise<User | null>;
	findOneByEmail(email: string, args?: findOneUserArgs): Promise<User | null>;
	findMany(args: findManyUserArgs): Promise<QueryManyWithCount<User>>;
	update(
		id: string,
		data: Prisma.UserUpdateInput,
	): Promise<PrismaRepositoryResponse>;
	delete(id: string): Promise<PrismaRepositoryResponse>;
	softDelete(id: string): Promise<PrismaRepositoryResponse>;
	verifyByEmail(email: string): Promise<boolean>;
	verifyById(id: string, isDeleted: boolean): Promise<boolean>;
	create(data: Prisma.UserCreateInput): Promise<User>;
	restore(id: string): Promise<PrismaRepositoryResponse>;
}
