import { CreatePodcastDto } from './create-podcast.dto';
import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNumber } from 'class-validator';
import { PodcastSearchInput } from './podcast.dto';
@InputType()
export class CreateEpisodeDto extends PodcastSearchInput {
  @Field(() => String)
  @IsString()
  readonly title: string;

  @Field(() => String)
  @IsString()
  readonly category: string;
}
