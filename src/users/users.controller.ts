import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { UserDTO } from "./user.model";
import { UsersService } from "./users.service";

@Controller("Users")
@ApiTags("Users")
export class UserController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOkResponse({
    status: 200,
    description: "Get all users",
    type: [UserDTO],
  })
  async getAllArtists() {
    return this.usersService.findAll();
  }
}
