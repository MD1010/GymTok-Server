import { IsNotEmpty, MinLength, MaxLength, IsString, IsEmail } from 'class-validator';
import { ApiProperty} from "@nestjs/swagger";


export class CreateUserDto {
    // username
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    @ApiProperty()
    readonly username: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    @ApiProperty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255) 
    @ApiProperty()
    readonly fullName: string;

    // Password
    @IsNotEmpty()
    @IsString()
    @MaxLength(1024)
    @ApiProperty()
    readonly password: string;

    // Password
    @IsString()
    @ApiProperty()
    readonly photoUrl: string;
  }