import { ObjectType, Field } from '@nestjs/graphql';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

@ObjectType()
export class CoreOutput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  error?: string;

  @Field(() => Boolean)
  @IsBoolean()
  ok: boolean;
}
