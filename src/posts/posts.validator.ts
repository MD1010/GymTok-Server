import { Injectable } from "@nestjs/common";
import { GenericValidator } from "../common/generic.validator";
import { Post, PostDto } from "./posts.model";
import { PostsService } from "./posts.service";

@Injectable()
export class PostsValidator extends GenericValidator<Post, PostDto> {
  constructor(private postsService: PostsService) {
    super(postsService.basicPostsService);
  }
}
