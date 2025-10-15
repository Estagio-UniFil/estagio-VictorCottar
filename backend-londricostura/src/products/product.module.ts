import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { JwtModule } from '@nestjs/jwt';
import { InventoryModule } from 'src/inventory/inventory.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    JwtModule.register({}),
    UserModule,
    AuthModule,
    InventoryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule { }
