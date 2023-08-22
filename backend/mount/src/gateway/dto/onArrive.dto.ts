import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OnArriveDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    idConnection: string;
}
