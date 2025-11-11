import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Costumer } from './entities/costumer.entity';
import { CostumerController } from './costumer.controller';
import { CostumerService } from './costumer.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { CityModule } from 'src/city/city.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Costumer]),
    JwtModule.register({}),
    UserModule,
    CityModule,
    AuthModule,
  ],
  controllers: [CostumerController],
  providers: [CostumerService],
})

export class CostumerModule { }