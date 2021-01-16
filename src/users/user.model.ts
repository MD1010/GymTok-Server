import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Document } from "mongoose";

export class User {
  @ApiProperty()
  username: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  recommendedChallenges: string[];

  @ApiProperty()
  acceptedChallenges: string[];

  @ApiResponseProperty()
  totalScore: number;
}

@Schema()
export class UserDocument extends Document {
  @Prop()
  username: string;

  @Prop()
  fullName: string;

  @Prop()
  image: string;

  @Prop()
  recommendedChallenges: string[];

  @Prop()
  acceptedChallenges: string[];

  @Prop()
  totalScore: number;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
