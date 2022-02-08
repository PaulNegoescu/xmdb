import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { readFile } from 'fs/promises';
import { resolve } from 'path';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  create(createMovieDto: CreateMovieDto) {
    const data = {
      ...createMovieDto,
      ratings: {
        createMany: {
          data: createMovieDto.ratings,
        },
      },
    };

    return this.prisma.movie.create({
      data,
    });
  }

  findAll(params?: {
    skip?: number;
    take?: number;
    cursor?: Prisma.MovieWhereUniqueInput;
    where?: Prisma.MovieWhereInput;
    orderBy?: Prisma.MovieOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.movie.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  findOne(id: string) {
    return this.prisma.movie.findUnique({
      where: { id },
    });
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
    return `This action updates a #${id} movie`;
  }

  remove(id: string) {
    return this.prisma.movie.delete({ where: { id } });
  }

  async resetDb() {
    // First empty the DB
    await this.prisma.rating.deleteMany({});
    await this.prisma.movie.deleteMany({});

    // Now read the file
    const file = (
      await readFile(resolve(__dirname, '../assets/movies.json'))
    ).toString();
    const { movies }: { movies: Array<CreateMovieDto> } = JSON.parse(file);

    const data = movies.map((movie) =>
      this.prisma.movie.create({
        data: {
          ...movie,
          title: String(movie.title),
          year: String(movie.year),
          released: movie.released && new Date(movie.released),
          dvd: movie.dvd && new Date(movie.dvd),
          ratings: {
            createMany: {
              data: movie.ratings,
            },
          },
        },
      }),
    );

    await Promise.all(data);

    return { message: '🔥' };
  }
}
