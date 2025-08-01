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
