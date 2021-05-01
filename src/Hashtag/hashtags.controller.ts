import { Controller, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { PostDto } from 'src/posts/posts.model';
import { PostsService } from 'src/posts/posts.service';
import { HashtagsHelper } from './hashtags.helper';
import { HashtagDto } from './hashtags.model';
import { HashtagsService } from './hashtags.service';


@Controller("hashtags")
@ApiTags("Hashtags")
export class HashtagsController {
  constructor(private hashtagsService: HashtagsService,
    private hashtagsHelper: HashtagsHelper,
    private postsService: PostsService) { }

  @Get()
  @ApiOkResponse({
    status: 200,
    description: "Get all hashtags",
    type: [HashtagDto],
  })
  async getAllHashtags(@Query("searchTerm") searchTerm: string) {
    return this.hashtagsService.findAllHashtags(searchTerm);
  }

  @Get("/popular")
  @ApiOkResponse({
    status: 200,
    description: "Get popular posts",
    type: [PostDto],
  })
  async getPopularHashtags(@Query("popularCount", ParseIntPipe) popularCount: number) {
    const hashtags = await this.hashtagsService.findAllHashtags();
    const posts = await this.postsService.basicPostsService.findAll();
    const postsPerHashtag = this.hashtagsHelper.getPostsPerHashtag(posts, hashtags);

    return this.hashtagsHelper.getPopularHashtags(postsPerHashtag, popularCount);
  }
}
