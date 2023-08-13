import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class EditUserDto {
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    nickname?: string;

    @IsBoolean()
    @IsOptional()
    twoFactorAuthentication?: boolean;

    @IsString()
    @IsOptional()
    twoFactorSecret?: string;
}
