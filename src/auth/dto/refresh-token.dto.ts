import { IsNotEmpty, MinLength, MaxLength, IsString } from 'class-validator';
import { ApiProperty} from "@nestjs/swagger";


export class RefreshTokenDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly username: string;
}