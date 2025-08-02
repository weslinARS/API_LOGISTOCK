import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
	ValidationPipe,
} from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiResponse,
} from "@nestjs/swagger";
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
}
