export class CreateArticleDto {
  readonly title: string;
  readonly isbn: string;
  readonly author: string;
  readonly description: string;
  readonly published_date: string;
  readonly publisher: string;
  readonly doi: string;  
  readonly updated_date?: string; 

}

