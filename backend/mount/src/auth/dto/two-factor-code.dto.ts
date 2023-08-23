import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class TwoFactorCodeDto {
    @IsNotEmpty()
    @IsString()
    code: string;

    @IsOptional()
    @IsString()
    nickname: string;
}
