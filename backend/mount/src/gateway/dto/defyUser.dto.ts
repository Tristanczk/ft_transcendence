import { IsNotEmpty, IsNumber,  } from 'class-validator';

export class DefyUserDto {
    @IsNumber()
    @IsNotEmpty()
    idUserB: number;
}
