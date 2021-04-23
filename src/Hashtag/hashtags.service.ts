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

  async findAllHashtags(searchTerm: string) {
    return searchTerm
    ? this.hashtagsModel.find({ hashtag: new RegExp(searchTerm, "i")})
    : this.basicHashtagsService.findAll();
  }

  async getOrCreateHashtags(hashtags: string[]) : Promise<string[]> {

    let hashtagsIds = [];

    for(let i=0; i < hashtags.length; i++) {
      try {
        const hashtag = hashtags[i];
        let tag = await this.findHashtagByName(hashtag);
        if(!tag) {
          tag = await this.createHashtag(hashtag);
        }

        hashtagsIds.push(tag._id);
      } catch(err) {
        console.log(err);
      }
    }

    return hashtagsIds;
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
