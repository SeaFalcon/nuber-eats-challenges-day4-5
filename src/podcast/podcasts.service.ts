import { Injectable } from '@nestjs/common';
import { CreateEpisodeDto } from './dtos/create-episode.dto';
import { CreatePodcastDto } from './dtos/create-podcast.dto';
import { UpdateEpisodeDto } from './dtos/update-episode.dto';
import { UpdatePodcastDto } from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { CoreOutput } from './dtos/output.dto';
import {
  PodcastOutput,
  PodcastSearchInput,
  EpisodesOutput,
  EpisodesSearchInput,
} from './dtos/podcast.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PodcastsService {
  constructor(
    @InjectRepository(Podcast)
    private readonly podcasts: Repository<Podcast>,
    @InjectRepository(Episode)
    private readonly episodes: Repository<Episode>,
  ) {}
  getAllPodcasts(): Promise<Podcast[]> {
    return this.podcasts.find({ relations: ['episodes'] });
  }

  async createPodcast({
    title,
    category,
  }: CreatePodcastDto): Promise<CoreOutput> {
    try {
      const exists = await this.podcasts.findOne({ title });
      if (exists) {
        return {
          ok: false,
          error: 'There is a Podcast with that title already',
        };
      }

      await this.podcasts.save(this.podcasts.create({ title, category }));

      return { ok: true, error: null };
    } catch {
      return { ok: true, error: "Couldn't create Podcast" };
    }
  }

  async getPodcast(id: number): Promise<PodcastOutput> {
    try {
      const podcast = await this.podcasts.findOne(
        { id },
        {
          join: {
            alias: 'podcast',
            innerJoinAndSelect: { episode: 'podcast.episodes' },
          },
          // loadRelationIds: true,
          // relations: ['episodes'],
        },
      );

      console.log('podcast', podcast);

      if (!podcast) {
        return {
          ok: false,
          error: `Id ${id} podcast doesn't exist!`,
        };
      }

      return {
        ok: true,
        podcast,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: `Couldn't find Podcast`,
      };
    }
  }

  async deletePodcast(id: number): Promise<CoreOutput> {
    const { ok, error, podcast } = await this.getPodcast(id);

    if (!ok) {
      return { ok, error };
    }
    try {
      await this.podcasts.delete({ id: podcast.id });

      return { ok };
    } catch {
      return {
        ok: false,
        error: "Couldn't delete Podcast.",
      };
    }
  }

  async updatePodcast({ id, ...rest }: UpdatePodcastDto): Promise<CoreOutput> {
    const { ok, error, podcast } = await this.getPodcast(id);

    if (!ok) {
      return { ok, error };
    }

    try {
      this.podcasts.update({ id: podcast.id }, { ...rest });

      return { ok };
    } catch {
      return {
        ok: false,
        error: "Couldn't update Podcast.",
      };
    }
  }

  async getEpisodes(podcastId: number): Promise<EpisodesOutput> {
    const { podcast, ok, error } = await this.getPodcast(podcastId);

    if (!ok) {
      return { ok, error };
    }

    return {
      ok: true,
      episodes: podcast.episodes,
      error: !podcast.episodes ? 'Episode not inserted yet' : null,
    };
  }

  async createEpisode({
    id: podcastId,
    title,
    category,
  }: CreateEpisodeDto): Promise<CoreOutput> {
    const { ok, error, podcast } = await this.getPodcast(podcastId);

    if (!ok) {
      return { ok, error };
    }

    try {
      const episode = await this.episodes.create({
        title,
        category,
        podcast,
      });
      await this.episodes.save(episode);

      return { ok: true };
    } catch (e) {
      console.log(e);
      return { ok: false, error: "Couldn't create Episode" };
    }
  }

  async deleteEpisode({
    podcastId,
    episodeId,
  }: EpisodesSearchInput): Promise<CoreOutput> {
    const { error, ok } = await this.getPodcast(podcastId);

    if (!ok) {
      return { ok, error };
    }

    try {
      await this.episodes.delete(episodeId);

      return { ok: true };
    } catch {
      return { ok: true, error: "Couldn't delete episode" };
    }
  }

  async updateEpisode({
    podcastId,
    episodeId,
    ...rest
  }: UpdateEpisodeDto): Promise<CoreOutput> {
    const { error, ok, podcast } = await this.getPodcast(podcastId);

    if (!ok) {
      return { ok, error };
    }

    try {
      this.episodes.update({ id: episodeId, podcast }, { ...rest });

      return { ok: true };
    } catch (e) {
      console.log(e);

      return {
        ok: false,
        error: "Couldn't update episode.",
      };
    }
  }
}
