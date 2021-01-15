import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { UserDocument } from "./user.model";
import { UsersService } from "./users.service";

@Controller("Users")
@ApiTags("Users")
export class UserController {
  constructor(private usersService: UsersService) { }

  @Get()
  @ApiOkResponse({
    status: 200,
    description: "Get all users",
    type: [UserDocument],
  })
  async getAllArtists() {
    return this.usersService.findAll();
  }

  @Post()
  @ApiOkResponse({
    status: 201,
    description: "Adds new challenge",
    type: UserDocument,
  })
  async addUser(@Body() user: UserDocument) {
    //todo - dor!!!
  }
}
