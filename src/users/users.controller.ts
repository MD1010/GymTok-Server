import { Controller, Get, Post, Body, UseGuards, Headers, HttpCode, HttpStatus, Param, Query, Delete, ParseIntPipe } from "@nestjs/common";
import { ApiOkResponse, ApiTags, ApiCreatedResponse, ApiHeader, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { UserDto } from "./user.model";
import { UsersService } from "./users.service";
import { AuthService } from "../auth/auth.service";
import { UsersValidator } from "./users.validator";
import { LinkPredictionService } from '../linkPrediction/linkPrediction.service';
import { LinkPredictionHelper } from '../linkPrediction/linkPrediction.helper';
import { PostsService } from "src/posts/posts.service";
import { PostsValidator } from "src/posts/posts.validator";
import { PostDto } from "src/posts/posts.model";
import { UsersHelper } from "./users.helper.";


@Controller("users")
@ApiTags("Users")
export class UserController {
  constructor(
    private usersService: UsersService,
    private usersValidator: UsersValidator,
    private postsValidator: PostsValidator,
    private authService: AuthService,
    private usersHelper: UsersHelper,
    private postsService: PostsService,
    private linkPredictionService: LinkPredictionService,
    private linkPredictionHelper: LinkPredictionHelper
  ) { }

  @Get()
  @ApiOkResponse({
    status: 200,
    description: "Get all users",
    type: [UserDto],
  })
  async getAllUsers(@Query("searchTerm") searchTerm: string, @Query("excludedIds") excludedIds: string[]) {
    return this.usersService.findAllUsers(searchTerm, excludedIds);
  }

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    status: 200,
    description: "Create a user",
    type: [CreateUserDto],
  })
  async register(@Body() createUserDto: CreateUserDto) {
    await this.usersValidator.throwErrorIfUserNameIsExist(createUserDto.username);
    return await this.usersService.create(createUserDto);
  }

  @Post('registerIfNeed')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    status: 200,
    description: "Create a user if need (for Google/Facebook signin)",
    type: [CreateUserDto],
  })
  async registerIfNeed(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.getOrCreate(createUserDto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    status: 200,
    description: "Login success",
    type: [LoginUserDto],
  })
  async login(@Body() loginUserDto: LoginUserDto) {
    await this.usersValidator.throwErrorIfUserNameIsNotExist(loginUserDto.username);
    return await this.usersService.login(loginUserDto);
  }

  @Post("/refresh")
  @ApiOkResponse({
    status: 200,
  })
  @ApiBearerAuth()
  async refresh(@Headers() headers) {
    return await this.authService.createAccessTokenFromRefreshToken(headers);
  }

  @Post("/:userId/posts/:postId/like")
  @ApiOkResponse({
    status: 200,
    description: "User like challenge",
    type: [UserDto],
  })
  async likePost(@Param("userId") userId: string, @Param("postId") postId: string) {
    const user = await this.usersValidator.getOrThrowErrorIfIdIsNotNotExist(userId);
    const post = await this.postsValidator.getOrThrowErrorIfIdIsNotNotExist(postId);

    if (!post.likes.includes(user._id)) {
      await this.postsService.addLike(postId, userId);
    }

    return user;
  }

  @Delete("/:userId/posts/:postId/like")
  @ApiOkResponse({
    status: 200,
    description: "User remove like for challenge",
    type: [UserDto],
  })
  async dislikePost(@Param("userId") userId: string, @Param("postId") postId: string) {
    const user = await this.usersValidator.getOrThrowErrorIfIdIsNotNotExist(userId);
    const post = await this.postsValidator.getOrThrowErrorIfIdIsNotNotExist(postId);

    if (post.likes.includes(user._id)) {
      await this.postsService.removeLike(postId, userId);
    }

    return user;
  }

  @Get(":username/recommendedPosts")
  @ApiOkResponse({
    status: 200,
    description: "Adds to the challenge id to the recommended challenges of the user ids",
    type: [PostDto],
  })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'size', type: Number, required: false })
  async getRecommendPostsByUserId(
    @Param("username") username: string,
    @Query("page", ParseIntPipe) page: number,
    @Query("size", ParseIntPipe) size: number
  ) {
    const user = await this.usersValidator.throwErrorIfUserNameIsNotExist(username);
    try {
      const postsAndTheirRecommendPercent = await this.linkPredictionService.getLinkPredictionCalculationResult(
        user._id
      );
      const allRecommendedPostsIds = this.linkPredictionHelper.getMostRecommendedPosts(
        postsAndTheirRecommendPercent
      );

      const currentPostsIdsPage = allRecommendedPostsIds.slice(page * size, (page + 1) * size);
      const posts = await this.postsService.findPostsByIds(currentPostsIdsPage);

      await this.usersHelper.addCreatedUserToPosts(posts);

      return posts;
    } catch (err) {
      const d = await this.postsService.getComplementPostsOfPostsIds(user.acceptedChallenges);
      return d.slice(page * size, (page + 1) * size);
    }
  }
}
