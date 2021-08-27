import { Episode } from './episode.entity';
import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { IsString, IsNumber } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from './common.entity';

@InputType('PodcastInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Podcast extends CoreEntity {
  @Field(() => String)
  @IsString()
  @Column()
  title: string;
  @Field(() => String)
  @IsString()
  @Column()
  category: string;
  @Field(() => Number, { defaultValue: 0 })
  @IsNumber()
  @Column({ default: 0 })
  rating: number;
  @Field(() => [Episode], { nullable: true })
  @OneToMany(() => Episode, (episode) => episode.podcast)
  episodes: Episode[];
}
