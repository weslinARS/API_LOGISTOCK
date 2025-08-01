import { Global, Module } from "@nestjs/common";
import { ProductRepository } from "src/repositories/product.repository";
import { UserRepository } from "src/repositories/user.repository";
import {
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
	],
	exports: [PrismaService, USER_REPOSITORY_SYMBOL, Product_REPOSITORY_SYMBOL],
})
export class PrismaModule {}
