import { Controller, Post, Get, Put, Body, Param, Query, Req, HttpException, HttpStatus } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // Submit an article
  @Post('submit')
  async submitArticle(@Body() createArticleDto: CreateArticleDto, @Req() req: Request) {
    try {
      // Get JWT token from Authorization header
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new HttpException('Token missing', HttpStatus.UNAUTHORIZED);
      }

      // Decode JWT token with a type assertion to ensure it's of type JwtPayload
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

      // Make sure the decoded token is not a string and contains the email property
      if (typeof decoded === 'object' && 'email' in decoded) {
        const submitterEmail = decoded.email;

        // Pass submitter information to the service layer
        return await this.articlesService.submitArticle(createArticleDto, submitterEmail);
      } else {
        throw new HttpException('Invalid token payload', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      console.error('Error while submitting article:', error.message);
      throw new HttpException('Failed to submit article', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Get all articles
  @Get()
  async getAllArticles() {
    return await this.articlesService.findAll();
  }

  // Search articles by query
  @Get('search')
  async searchArticles(@Query('q') query: string) {
    return await this.articlesService.searchArticles(query);
  }

  // Get articles pending moderation
  @Get('moderation')
  async getModerationQueue() {
    return await this.articlesService.getModerationQueue();
  }

  // Handle moderation of an article
  @Put('moderation/:id')
  async handleModeration(
    @Param('id') id: string,
    @Body() body: { action: string },
  ) {
    return await this.articlesService.handleModeration(id, body.action);
  }

  // Get articles pending analysis
  @Get('analysis')
  async getAnalysisQueue() {
    return await this.articlesService.getAnalysisQueue();
  }

  // Analyze an article and save the result to the database
  @Put('analysis/:id')
  async submitAnalysis(
    @Param('id') id: string,
    @Body() body: { analysisResult: string },
  ) {
    return await this.articlesService.submitAnalysis(id, body.analysisResult);
  }
}
