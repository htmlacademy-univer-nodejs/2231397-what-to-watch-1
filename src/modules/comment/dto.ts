import { IsInt, IsMongoId, IsString, Length, Max, Min } from 'class-validator';

export class TComment {
  @IsString({message: 'required field'})
  @Length(5, 1024, {message: '2 to 100 symbols'})
  public text!: string;

  @IsInt({message: 'must be an integer'})
  @Min(0, {message: 'min rating is 0'})
  @Max(10, {message: 'max rating is 10'})
  public rating!: number;

  @IsMongoId({message: 'movieId field must be valid an id'})
  public movieId!: string;
}
