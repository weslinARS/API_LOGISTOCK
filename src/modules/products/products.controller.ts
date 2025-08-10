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
import { CreateProductDto } from "./dtos/create-product.dto";
import { ProductsService } from "./products.service";

@Controller("products")
@ApiBearerAuth()
@UseGuards(PoliceGuard)
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Post()
	@ApiOperation({
		summary: "Create a new product",
	})
	@ApiBody({
		type: CreateProductDto,
		required: true,
	})
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: "Product created successfully",
	})
	@Roles([ROLES.ADMIN, ROLES.MANAGER])
	@HttpCode(HttpStatus.CREATED)
	async createProduct(@Body(new ValidationPipe()) data: CreateProductDto) {
		return this.productsService.createProduct(data);
	}
}
