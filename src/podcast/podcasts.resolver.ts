import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PodcastsService } from './podcasts.service';
import { Podcast } from './entities/podcast.entity';
import { CreatePodcastDto } from './dtos/create-podcast.dto';
import { CoreOutput } from './dtos/output.dto';
import {
  PodcastSearchInput,
  PodcastOutput,
  EpisodesOutput,
  EpisodesSearchInput,
} from './dtos/podcast.dto';
import { UpdatePodcastDto } from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { CreateEpisodeDto } from './dtos/create-episode.dto';
import { UpdateEpisodeDto } from './dtos/update-episode.dto';

@Resolver(() => Podcast)
export class PodcastsResolver {
  constructor(private readonly podcastsService: PodcastsService) {}

  @Query(() => [Podcast])
  getAllPodcasts(): Promise<Podcast[]> {
    return this.podcastsService.getAllPodcasts();
  }

  @Mutation(() => CoreOutput)
  createPodcast(
    @Args('input') createPodcastDto: CreatePodcastDto,
  ): Promise<CoreOutput> {
    return this.podcastsService.createPodcast(createPodcastDto);
  }

  @Query(() => PodcastOutput)
  getPodcast(
    @Args('input') podcastSearchInput: PodcastSearchInput,
  ): Promise<PodcastOutput> {
    return this.podcastsService.getPodcast(podcastSearchInput.id);
  }

  @Mutation(() => CoreOutput)
  deletePodcast(@Args('input') podcastSearchInput: PodcastSearchInput) {
    return this.podcastsService.deletePodcast(podcastSearchInput.id);
  }

  @Mutation(() => CoreOutput)
  updatePodcast(
    @Args('input') updatePodcastDto: UpdatePodcastDto,
  ): Promise<CoreOutput> {
    return this.podcastsService.updatePodcast(updatePodcastDto);
  }
}

@Resolver(() => Episode)
export class EpisodeResolver {
  constructor(private readonly podcastService: PodcastsService) {}

  @Query(() => EpisodesOutput)
  getEpisodes(
    @Args('input') podcastSearchInput: PodcastSearchInput,
  ): Promise<EpisodesOutput> {
    return this.podcastService.getEpisodes(podcastSearchInput.id);
  }

  @Mutation(() => CoreOutput)
  createEpisode(
    @Args('input') createEpisodeDto: CreateEpisodeDto,
  ): Promise<CoreOutput> {
    return this.podcastService.createEpisode(createEpisodeDto);
  }

  // @Mutation(() => CoreOutput)
  // updateEpisode(@Args('input') updateEpisodeDto: UpdateEpisodeDto) {
  //   return this.podcastService.updateEpisode(updateEpisodeDto);
  // }

  // @Mutation(() => CoreOutput)
  // deleteEpisode(
  //   @Args('input') episodesSearchInput: EpisodesSearchInput,
  // ): CoreOutput {
  //   return this.podcastService.deleteEpisode(episodesSearchInput);
  // }
}
