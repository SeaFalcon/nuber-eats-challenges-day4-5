import { InputType, ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { IsNumber, IsString } from 'class-validator';
import { CoreEntity } from './common.entity';
import { Podcast } from './podcast.entity';

@InputType('EpisodeInput', { isAbstract: true })
@ObjectType()
@Entity()
export class Episode extends CoreEntity {
  @Field(() => String)
  @IsString()
  @Column()
  title: string;
  @Field(() => String)
  @IsString()
  @Column()
  category: string;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  @Column({ default: 0 })
  rating: number;

  @Field(() => Podcast)
  @ManyToOne(() => Podcast, (podcast) => podcast.episodes, {
    onDelete: 'CASCADE',
  })
  podcast: Podcast;

  @RelationId((episode: Episode) => episode.podcast)
  podcastId: number;
}
