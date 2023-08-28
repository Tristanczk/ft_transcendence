import { IsNotEmpty, IsNumber } from "class-validator";

export class InitGameDto {
	@IsNotEmpty()
	@IsNumber()
	idPlayerB: number;

	@IsNotEmpty()
	@IsNumber()
	mode: number;
}