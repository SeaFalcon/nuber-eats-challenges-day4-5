import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { EpisodesSearchInput } from './podcast.dto';

@InputType()
export class UpdateEpisodeDto extends EpisodesSearchInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  readonly title?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  readonly category?: string;
}
