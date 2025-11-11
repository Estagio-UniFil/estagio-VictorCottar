import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, Min, ValidateNested } from "class-validator";

class ImportItemDto {
  @IsString() code!: string;
  @IsString() name!: string;
  @IsNumber() @Min(0) price!: number;
  @IsNumber() @Min(0) quantity!: number;
}

export class ImportConfirmDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportItemDto)
  items!: ImportItemDto[];
}
