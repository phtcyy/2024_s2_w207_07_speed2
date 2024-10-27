import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Article extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  isbn: string;

  @Prop({ required: true })
  author: string;

  @Prop()
  description: string;

  @Prop()
  published_date: Date;

  @Prop()
  publisher: string;

  @Prop({ default: Date.now })
  updated_date: Date;

  @Prop({ required: true })  
  doi: string;

  @Prop({ default: 'pending_moderation' })  
  status: string;

  @Prop()
  analysisResult: string;  

  @Prop({ required: true })  
  submitter: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
