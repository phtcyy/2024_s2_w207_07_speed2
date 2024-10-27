import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(), 
    MongooseModule.forRoot(process.env.DB_URI), 
    ArticlesModule,
  ],
})
export class AppModule {}


