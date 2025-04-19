export interface IQueryBuilder {
  orLanguages(language: string): this;
  orLanguages(languages: string[]): this;

  andLanguages(language: string): this;
  andLanguages(languages: string[]): this;

  setSize(size: number): this;

  author(author: string): this;

  sentiment(sentiment: "POSITIVE" | "NEGATIVE"): this;

  andTexts(texts: string): this;
  andTexts(texts: string[]): this;

  orTexts(texts: string): this;
  orTexts(texts: string[]): this;

  andSiteTypes(siteType: string): this;
  andSiteTypes(siteTypes: string[]): this;

  orSiteTypes(siteType: string): this;
  orSiteTypes(siteTypes: string[]): this;

  published(date: string): this;

  category(category: string): this;

  build(): {
    q: string;
    size: number;
  };
}

export interface IQuery {
  q: string;
  size: number;
}
