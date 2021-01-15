import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { Document } from "mongoose";

export class ChallengeDTO {
  @ApiResponseProperty()
  createdBy: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  estimatedScore: number;

  @ApiProperty()
  image: string;

  @ApiProperty()
  video: string;
}

@Schema()
export class Challenge extends Document {
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
