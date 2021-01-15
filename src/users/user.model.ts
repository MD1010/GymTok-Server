import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { Document } from "mongoose";

export class UserDto {
  @ApiResponseProperty()
  _id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  recommendedChallenges: string[];

  @ApiProperty()
  totalScore: number;
}

@Schema()
export class User extends Document {
  @Prop()
  username: string;

  @Prop()
  fullName: string;

  @Prop()
  image: string;

  @Prop()
  recommendedChallenges: string[];

  @Prop()
  totalScore: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
