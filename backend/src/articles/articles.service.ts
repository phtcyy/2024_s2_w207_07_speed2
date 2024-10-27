import { Injectable } from '@nestjs/common'; // Import the Injectable decorator
import { InjectModel } from '@nestjs/mongoose'; // Import InjectModel for dependency injection
import { Model } from 'mongoose'; // Import Model from Mongoose
import { Article } from './schemas/article.schema'; // Import the Article schema
import { CreateArticleDto } from './dto/create-article.dto'; // Import DTO for article creation
import { isValidObjectId } from 'mongoose'; // Import to validate MongoDB Object IDs
import { HttpException, HttpStatus } from '@nestjs/common'; // Import HttpException and HttpStatus for error handling

@Injectable() // Mark the class as a provider
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>, // Inject the Article model
  ) {}

  // Submit an article and save submitter information
  async submitArticle(createArticleDto: CreateArticleDto, submitterEmail: string): Promise<Article> {
    const createdArticle = new this.articleModel({
      ...createArticleDto, // Spread operator to include properties from the DTO
      updated_date: new Date(), // Set the current date as updated date
      status: 'pending_moderation',  // Initial status is set to pending moderation
      submitter: submitterEmail,  // Save the submitter's email
    });
    return createdArticle.save(); // Save the article to the database
  }

  // Get all articles
  async findAll(): Promise<Article[]> {
    return this.articleModel.find().exec(); // Retrieve all articles from the database
  }

  // Get articles pending moderation
  async getModerationQueue(): Promise<Article[]> {
    return this.articleModel.find({ status: 'pending_moderation' }).exec(); // Retrieve articles that are pending moderation
  }

  // Search articles by title
  async searchArticles(query: string): Promise<Article[]> {
    return this.articleModel.find({ title: new RegExp(query, 'i') }).exec(); // Search for articles matching the title
  }

  // Handle moderation (approve or reject an article)
  async handleModeration(id: string, action: string): Promise<Article> {
    const article = await this.articleModel.findById(id).exec(); // Find the article by ID
    if (action === 'approve') {
      article.status = 'pending_analysis'; // Set status to pending analysis if approved
    } else if (action === 'reject') {
      article.status = 'rejected'; // Set status to rejected if not approved
    }
    return article.save(); // Save the updated article
  }

  // Get articles pending analysis
  async getAnalysisQueue(): Promise<Article[]> {
    return this.articleModel.find({ status: 'pending_analysis' }).exec(); // Retrieve articles that are pending analysis
  }

  // Analyze an article and save the result to the database, setting status to approved
  async submitAnalysis(id: string, analysisResult: string): Promise<Article> {
    const article = await this.articleModel.findById(id).exec(); // Find the article by ID
    article.status = 'approved'; // Set status to approved
    article.analysisResult = analysisResult; // Save the analysis result
    return article.save(); // Save the updated article
  }
}
