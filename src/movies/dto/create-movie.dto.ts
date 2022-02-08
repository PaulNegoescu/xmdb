import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator';

enum Type {
  SERIES = 'series',
  MOVIE = 'movie',
}

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty({
    message: 'You need to provide a title for the movie.',
  })
  public title: string;

  @IsString()
  @IsNotEmpty()
  public year: string;

  @IsString()
  @IsOptional()
  public rated: string;

  @IsDate()
  @IsOptional()
  public released: Date;

  @IsNumber()
  @IsOptional()
  public runtime: number;

  @IsString()
  @IsNotEmpty()
  public genre: string;

  @IsString()
  @IsOptional()
  public director: string;

  @IsString()
  @IsOptional()
  public writer: string;

  @IsString()
  @IsOptional()
  public actors: string;

  @IsString()
  @IsOptional()
  public plot: string;

  @IsString()
  @IsOptional()
  public language: string;

  @IsString()
  @IsOptional()
  public country: string;

  @IsString()
  @IsOptional()
  public awards: string;

  @IsString()
  @IsOptional()
  public poster: string;

  @IsNumber()
  @IsOptional()
  public metascore: number;

  @IsNumber()
  @IsOptional()
  public imdbrating: number;

  @IsNumber()
  @IsOptional()
  public imdbvotes: number;

  @IsString()
  @IsNotEmpty()
  public imdbid: string;

  @IsString()
  @IsEnum(Type)
  @IsOptional()
  public type: Type;

  @IsDate()
  @IsOptional()
  public dvd: Date;

  @IsNumber()
  @IsOptional()
  public boxoffice: number;

  @IsString()
  @IsOptional()
  public production: string;

  @IsString()
  @IsOptional()
  public website: string;

  @IsNumber()
  @IsOptional()
  public totalseasons: number;

  @IsArray()
  @IsOptional()
  public ratings: Array<Rating>;
}

class Rating {
  @IsString()
  @IsNotEmpty()
  public source: string;

  @IsString()
  @IsNotEmpty()
  public value: string;
}
