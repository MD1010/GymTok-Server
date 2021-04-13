import { Injectable, UnauthorizedException, NotFoundException, BadRequestException, Get } from '@nestjs/common';
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { GenericDalService } from "../common/genericDalService.service";
import { Hashtag, HashtagDto } from './hashtags.model';

@Injectable()
export class HashtagsService {
  public basicHashtagsService: GenericDalService<Hashtag, HashtagDto>;
  constructor(
    @InjectModel(Hashtag.name) private readonly hashtagsModel: Model<Hashtag>,
  ) {
    this.basicHashtagsService = new GenericDalService<Hashtag, HashtagDto>(hashtagsModel);
  }

  async findAllHashtags() {
    return this.basicHashtagsService.findAll();
  }

  async findHashtagByName(hashtag: string) {
    try{
      const hash = await this.hashtagsModel.findOne({hashtag});
      return hash;
    }catch(err) {
      console.log(err);
    }
    
    return null;
  }

  async createHashtag(hashtag: string) {
    const hashtagDto = new HashtagDto();
    hashtagDto.hashtag = hashtag;
    return await this.basicHashtagsService.createEntity(hashtagDto);
  }
}
