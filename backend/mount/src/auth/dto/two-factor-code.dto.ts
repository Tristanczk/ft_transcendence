import { IsString, IsNotEmpty } from 'class-validator';

export class TwoFactorCodeDto {
    @IsNotEmpty()
    @IsString()
    code: string;
}
