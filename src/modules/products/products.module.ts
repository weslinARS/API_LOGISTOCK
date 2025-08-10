import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

@Module({
	controllers: [ProductsController],
	providers: [ProductsService, PrismaModule],
})
export class ProductsModule {}
