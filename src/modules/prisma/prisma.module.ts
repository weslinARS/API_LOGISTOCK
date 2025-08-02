import { Global, Module } from "@nestjs/common";
import { ProductBrandRepository } from "src/repositories/product-brand.repository";
import { ProductRepository } from "src/repositories/product.repository";
import { UserRepository } from "src/repositories/user.repository";
import {
	PRODUCT_BRAND_REPOSITORY_SYMBOL,
	PRODUCT_CATEGORY_REPOSITORY_SYMBOL,
	Product_REPOSITORY_SYMBOL,
	USER_REPOSITORY_SYMBOL,
} from "src/shared/common/common-constant";
import { PrismaService } from "./prisma.service";
@Global()
@Module({
	providers: [
		PrismaService,
		{
			provide: USER_REPOSITORY_SYMBOL,
			useClass: UserRepository,
		},
		{
			provide: Product_REPOSITORY_SYMBOL,
			useClass: ProductRepository,
		},
		{
			provide: PRODUCT_BRAND_REPOSITORY_SYMBOL,
			useClass: ProductBrandRepository,
		},
		{
			provide: PRODUCT_CATEGORY_REPOSITORY_SYMBOL,
			useClass: ProductBrandRepository,
		},
	],
	exports: [
		PrismaService,
		USER_REPOSITORY_SYMBOL,
		Product_REPOSITORY_SYMBOL,
		PRODUCT_BRAND_REPOSITORY_SYMBOL,
		PRODUCT_CATEGORY_REPOSITORY_SYMBOL,
	],
})
export class PrismaModule {}
