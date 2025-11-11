import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleItem } from './entities/sale-item.entity';
import { SaleItemService } from './sale-item.service';
import { SaleItemController } from './sale-item.controller';
import { InventoryModule } from 'src/inventory/inventory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SaleItem]),
    InventoryModule,
  ],
  controllers: [SaleItemController],
  providers: [SaleItemService],
  exports: [TypeOrmModule, SaleItemService],
})
export class SaleItemModule { }
