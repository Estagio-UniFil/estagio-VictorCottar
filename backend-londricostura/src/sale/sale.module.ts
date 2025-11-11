// sale/sale.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { SaleItem } from 'src/sale-item/entities/sale-item.entity';
import { Product } from 'src/products/entities/product.entity';
import { InventoryModule } from 'src/inventory/inventory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, SaleItem, Product]),
    InventoryModule,
  ],
  controllers: [SaleController],
  providers: [SaleService],
})
export class SaleModule { }
