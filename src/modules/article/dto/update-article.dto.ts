import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './create-article.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  @IsString()
  @IsOptional()
  article_name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsString()
  @IsOptional()
  user_id?: string;
}
