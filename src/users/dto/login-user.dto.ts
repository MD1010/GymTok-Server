import { IsNotEmpty, MinLength, MaxLength, IsString } from 'class-validator';
import { ApiProperty} from "@nestjs/swagger";


export class LoginUserDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    @ApiProperty()
    readonly username: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(1024)
    @ApiProperty()
    readonly password: string;
}