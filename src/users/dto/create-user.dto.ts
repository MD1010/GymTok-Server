import { IsNotEmpty, MinLength, MaxLength, IsString } from 'class-validator';
import { ApiProperty} from "@nestjs/swagger";


export class CreateUserDto {
    // username
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    @ApiProperty()
    readonly username: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255) 
    @ApiProperty()
    readonly fullName: string;

    // Password
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(1024)
    @ApiProperty()
    readonly password: string;
  }