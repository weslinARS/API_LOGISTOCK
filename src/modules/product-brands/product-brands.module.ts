import { Module } from '@nestjs/common';
import { ProductBrandsService } from './product-brands.service';
import { ProductBrandsController } from './product-brands.controller';

@Module({
  providers: [ProductBrandsService],
  controllers: [ProductBrandsController]
})
export class ProductBrandsModule {}
