import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { Document } from "mongoose";

@Schema()
export class User extends Document {
  @Prop()
  username: string;

  @ApiProperty()
  @Prop()
  fullName: string;

  @ApiProperty()
  @Prop()
  image: string;

  @ApiProperty()
  @Prop()
  recommendedChallenges: string[];

  @ApiProperty()
  @Prop()
  acceptedChallenges: string[];

  @ApiResponseProperty()
  @Prop({ default: 0 })
  totalScore: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
