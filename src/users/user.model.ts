import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiResponseProperty} from "@nestjs/swagger";
import { Document } from "mongoose";

export class UserDto {
  @ApiResponseProperty()
  _id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

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
export class User extends Document {
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  fullName: string;

  @Prop()
  image: string;

  @Prop()
  recommendedChallenges: string[];

  @Prop()
  acceptedChallenges: string[];

  @Prop({ default: 0 })
  totalScore: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
