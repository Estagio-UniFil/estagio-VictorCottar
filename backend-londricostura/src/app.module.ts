import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CostumerModule } from './costumer/costumer.module';
import { ProductModule } from './products/product.module';
import { InventoryModule } from './inventory/inventory.module';
import { SaleItemModule } from './sale-item/sale-item.module';
import { SaleModule } from './sale/sale.module';
import { CityModule } from './city/city.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // remover quando for subir para prod
        connectTimeoutMS: 10000,
        retryDelay: 3000,
        retryAttempts: 5,   
      }),
    }),
    UserModule,
    ProductModule,
    SaleItemModule,
    SaleModule,
    CityModule,
    InventoryModule,
    CostumerModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
