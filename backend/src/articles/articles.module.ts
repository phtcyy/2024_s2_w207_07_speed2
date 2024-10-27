import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { Article, ArticleSchema } from './schemas/article.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Article', schema: ArticleSchema, collection: 'articles' }]),  // 这里指定 'articles' 集合
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
