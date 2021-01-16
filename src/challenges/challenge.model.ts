import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { Document } from "mongoose";

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
