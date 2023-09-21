import { IsNotEmpty } from 'class-validator';

export class GetFriendListDto {
    @IsNotEmpty()
    nick: string;
}
