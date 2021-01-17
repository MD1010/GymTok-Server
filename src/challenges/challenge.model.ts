import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { Document } from "mongoose";


export class ChallengeDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  description: string;

  // @ApiResponseProperty()
  // @Prop({ default: new Date() })
  // creationTime: Date;

  @ApiProperty()
  estimatedScore: number;

  @ApiProperty()
  image: string;

  @ApiProperty()
  video: string;
}


@Schema()
export class Challenge extends Document {
  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  createdBy: string;

  @ApiProperty()
  @Prop()
  description: string;

  // @ApiResponseProperty()
  // @Prop({ default: new Date() })
  // creationTime: Date;

  @ApiProperty()
  @Prop()
  estimatedScore: number;

  @ApiProperty()
  @Prop()
  image: string;

  @ApiProperty()
  @Prop()
  video: string;
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
