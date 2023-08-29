import { IsNumber, IsString, IsBoolean, IsOptional } from 'class-validator';


export class CreateChannelDto {
	@IsNumber()
    idAdmin: number;

    @IsString()
    name: string;

    @IsOptional()
    @IsBoolean()
    isPublic?: boolean;

    @IsOptional()
    @IsString()
    password?: string;
}
