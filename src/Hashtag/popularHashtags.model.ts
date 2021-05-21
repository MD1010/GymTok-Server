import { Post, PostDto } from "src/posts/posts.model";

export interface PopularHashtags {
    [hashtag: string]: Post[]
}