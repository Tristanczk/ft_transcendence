import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class updateGameDto {
    @IsNotEmpty()
    @IsNumber()
    scoreA: number;

    @IsNotEmpty()
    @IsNumber()
    scoreB: number;

    @IsNotEmpty()
    @IsBoolean()
    won: boolean;

    @IsNotEmpty()
    @IsBoolean()
    aborted: boolean
}
