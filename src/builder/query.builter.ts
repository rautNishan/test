//Since mention on
// https://docs.webz.io/reference/output
// https://docs.webz.io/reference/news-api-lite (Limitations section)

//This query builder will only build query on Post Object and only searchable sections mention on (https://docs.webz.io/reference/filters)

export class QueryBuilder {
  private q: string;
  private lang: string;
  private filters: string[] = [];
  constructor(q: string) {
    this.q = q;
  }

  public orLanguages(language: string): this;
  public orLanguages(languages: string[]): this;

  //Method overloading
  public orLanguages(lang: string[] | string) {
    if (Array.isArray(lang)) {
      if (lang.length < 1) {
        return this;
      }

      //This is the first time lang is being initialize so
      if (this.lang === undefined) {
        const refStr = lang.map((lang) => `language:${lang}`).join(" OR ");
        this.lang = `(${refStr})`;
        return this;
      }
      //If lang value was set and trying to or then
      else {
        const refStr = `(${lang
          .map((lang) => `language:${lang}`)
          .join(" OR ")})`;
        this.lang += " OR " + refStr;
        return this;
      }
    }
    //This is the first time lang is being initialize so
    if (this.lang === undefined) {
      this.lang = `language:${lang}`;
      return this;
    }
    //If lang value was set and trying to or then
    else {
      this.lang += " OR " + `language:${lang}`;
      return this;
    }
  }

  public andLanguages(language: string): this;
  public andLanguages(languages: string[]): this;

  //Method overloading
  public andLanguages(lang: string[] | string) {
    if (Array.isArray(lang)) {
      if (lang.length < 1) {
        return this;
      }

      //This is the first time lang is being initialize so
      if (this.lang === undefined) {
        const refStr = lang.map((lang) => `language:${lang}`).join(" AND ");
        this.lang = `(${refStr})`;
        return this;
      }
      //If lang value was set and trying to or then
      else {
        const refStr = `(${lang
          .map((lang) => `language:${lang}`)
          .join(" AND ")})`;
        this.lang += " AND " + refStr;
        return this;
      }
    }
    //If only one string
    //This is the first time lang is being initialize so
    if (this.lang === undefined) {
      this.lang = `(language:${lang})`;
      return this;
    }
    //If lang value was set and trying to or then
    else {
      this.lang += " AND " + `language:${lang}`;
      return this;
    }
  }

  public build() {
    this.lang = `(${this.lang})`; //Make sure to close in bracket at final

    this.filters.push(this.q);
    this.filters.push(this.lang);
    const filter = this.filters.map((filter) => filter).join(" ");
    return { q: filter };
  }
}
