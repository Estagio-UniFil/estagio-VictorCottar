import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([City]),
    JwtModule.register({}),
    CityModule,
    AuthModule,
  ],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
