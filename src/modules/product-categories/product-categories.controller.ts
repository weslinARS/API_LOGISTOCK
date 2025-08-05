import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Query,
	UseGuards,
	ValidationPipe,
} from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiQuery,
	ApiResponse,
} from "@nestjs/swagger";
import { QueryParamBaseManyRecords } from "src/shared/class/api-request.class";
import { Roles } from "src/shared/decorators/roles/roles.decorator";
import { ROLES } from "src/shared/enums/roles.enum";
import { PoliceGuard } from "src/shared/guards/police/police.guard";
import { CreateProductCategoryDto } from "./dtos/create-product-category.dto";
import { ProductCategoriesService } from "./product-categories.service";

@Controller("product-categories")
@ApiBearerAuth()
@UseGuards(PoliceGuard)
export class ProductCategoriesController {
	constructor(
		private readonly productCategoryService: ProductCategoriesService,
	) {}

	@Post()
	@ApiOperation({
		summary: "Creates a new product category",
	})
	@ApiBody({
		type: CreateProductCategoryDto,
		required: true,
	})
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: "Product category created successfully",
	})
	@ApiResponse({
		status: HttpStatus.CONFLICT,
		description: "Product category already exists",
	})
	@Roles([ROLES.ADMIN, ROLES.MANAGER])
	@HttpCode(HttpStatus.CREATED)
	async create(@Body(new ValidationPipe()) data: CreateProductCategoryDto) {
		return this.productCategoryService.create(data);
	}

	@Get()
	@ApiOperation({
		summary: "Retrieves all product categories",
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Product categories retrieved successfully",
	})
	@ApiQuery({
		name: "include",
		isArray: true,
		type: String,
		required: false,
	})
	@ApiQuery({
		name: "count",
		isArray: true,
		type: String,
		required: false,
	})
	@ApiQuery({
		name: "isSearchMode",
		type: Boolean,
		required: false,
	})
	@Roles([ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER])
	@HttpCode(HttpStatus.OK)
	async findMany(
		@Query(new ValidationPipe()) queryParams: QueryParamBaseManyRecords,
	) {
		return this.productCategoryService.findMany(queryParams);
	}
}
