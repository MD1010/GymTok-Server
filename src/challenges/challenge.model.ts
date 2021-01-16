import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { Document } from "mongoose";

export class ChallengeDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  createdBy: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
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

  @Prop()
  estimatedScore: number;

  @Prop()
  image: string;

  @Prop()
  video: string;
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
