import { Prisma } from "~gen-prisma/index";

export type CommonAgrs = {
	includeDeleted?: boolean;
	isSearchMode?: boolean;
	pageIndex?: number;
	pageSize?: number;
	allRecords?: boolean;
};

export type QueryManyWithCount<T extends object> = {
	records: T[];
	count: number;
};

export interface PrismaRepositoryResponse {
	success: boolean;

	data?: string;
}
// user

export type findOneUserArgs = CommonAgrs & {
	include?: Prisma.UserInclude;
	select?: Prisma.UserSelect;
	omit?: Prisma.UserOmit;
};

export type findManyUserArgs = findOneUserArgs & {
	where?: Prisma.UserWhereInput;
	orderBy?: Prisma.UserOrderByWithRelationInput;
};
