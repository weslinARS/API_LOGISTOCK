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
import { CreateProductBrandDto } from "./dtos/create-product-brand.dto";
import { ProductBrandsService } from "./product-brands.service";

@Controller("product-brands")
@ApiBearerAuth()
@UseGuards(PoliceGuard)
export class ProductBrandsController {
	constructor(private readonly productBrandService: ProductBrandsService) {}

	@Post()
	@ApiOperation({
		summary: "Creates a new product brand",
	})
	@ApiBody({
		type: CreateProductBrandDto,
		description: "Data to create a new product brand",
		required: true,
	})
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: "Product brand created successfully",
	})
	@Roles([ROLES.ADMIN, ROLES.MANAGER])
	@HttpCode(HttpStatus.CREATED)
	async create(@Body(new ValidationPipe()) data: CreateProductBrandDto) {
		return this.productBrandService.create(data);
	}
}
