import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { Document } from "mongoose";
import { BasicEntityDto } from "../common/basicEntity.dto";


export class ChallengeDto extends BasicEntityDto {
  @ApiResponseProperty()
  _id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  createdBy: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiResponseProperty()
  creationTime: Date;

  @ApiProperty()
  estimatedScore: number;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsString()
  video: string;
}

@Schema()
export class Challenge extends Document {
  @Prop()
  name: string;

  @Prop()
  createdBy: string;

  @Prop()
  description: string;

  @Prop({ default: new Date() })
  creationTime: Date;

  @Prop()
  estimatedScore: number;

  @Prop()
  image: string;

  @Prop()
  video: string;
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
