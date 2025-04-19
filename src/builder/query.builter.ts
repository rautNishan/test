//Since mention on
// https://docs.webz.io/reference/output
// https://docs.webz.io/reference/news-api-lite (Limitations section)

import { IQuery, IQueryBuilder } from "./interfaces/builder.interface";

//This query builder will only build query on Post Object and only searchable sections mention on (https://docs.webz.io/reference/filters)

/**
 * Important : Lots of functions are missing add accordingly
 */
export class QueryBuilder implements IQueryBuilder {
  private q: string;
  private lang: string;
  private filters: string[] = [];
  private size: number = 10; //default value
  private text: string;
  private siteType: string;
  private order: string = "asc";
  private sort: string;
  private from: number;

  constructor(q: string) {
    this.q = q;
    this.filters.push(this.q);
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
      this.lang = `language:${lang}`;
      return this;
    }
    //If lang value was set and trying to or then
    else {
      this.lang += " AND " + `language:${lang}`;
      return this;
    }
  }

  public setSize(size: number) {
    this.size = size;
    return this;
  }

  public author(author: string) {
    this.filters.push(`author:${author}`);
    return this;
  }

  public sentiment(sentiment: "POSITIVE" | "NEGATIVE") {
    this.filters.push(`sentiment:${sentiment}`);
    return this;
  }

  public andTexts(texts: string): this;
  public andTexts(texts: string[]): this;

  //Method overloading
  public andTexts(texts: string[] | string) {
    if (Array.isArray(texts)) {
      if (texts.length < 1) {
        return this;
      }

      //This is the first time lang is being initialize so
      if (this.text === undefined) {
        const refStr = texts.map((text) => `text:${text}`).join(" AND ");
        this.text = `(${refStr})`;
        return this;
      }
      //If lang value was set and trying to or then
      else {
        const refStr = `(${texts.map((text) => `text:${text}`).join(" AND ")})`;
        this.text += " AND " + refStr;
        return this;
      }
    }
    //If only one string
    //This is the first time lang is being initialize so
    if (this.text === undefined) {
      this.text = `text:${texts}`;
      return this;
    }
    //If text value was set and trying to or then
    else {
      this.text += " AND " + `text:${texts}`;
      return this;
    }
  }

  public orTexts(texts: string): this;
  public orTexts(texts: string[]): this;

  //Method overloading
  public orTexts(texts: string[] | string) {
    if (Array.isArray(texts)) {
      if (texts.length < 1) {
        return this;
      }

      //This is the first time text is being initialize so
      if (this.text === undefined) {
        const refStr = texts.map((text) => `text:${text}`).join(" OR ");
        this.text = `(${refStr})`;
        return this;
      }
      //If text value was set and trying to or then
      else {
        const refStr = `(${texts.map((text) => `text:${text}`).join(" OR ")})`;
        this.text += " OR " + refStr;
        return this;
      }
    }
    //If only one string
    //This is the first time text is being initialize so
    if (this.text === undefined) {
      this.text = `text:${texts}`;
      return this;
    }
    //If text value was set and trying to or then
    else {
      this.text += " OR " + `text:${texts}`;
      return this;
    }
  }

  public andSiteTypes(siteTypes: string): this;
  public andSiteTypes(siteTypes: string[]): this;

  //Method overloading
  public andSiteTypes(siteTypes: string[] | string) {
    if (Array.isArray(siteTypes)) {
      if (siteTypes.length < 1) {
        return this;
      }

      //This is the first time lang is being initialize so
      if (this.siteType === undefined) {
        const refStr = siteTypes
          .map((text) => `site_type:${text}`)
          .join(" AND ");
        this.siteType = `(${refStr})`;
        return this;
      }
      //If lang value was set and trying to or then
      else {
        const refStr = `(${siteTypes
          .map((text) => `site_type:${text}`)
          .join(" AND ")})`;
        this.siteType += " AND " + refStr;
        return this;
      }
    }
    //If only one string
    //This is the first time siteType is being initialize so
    if (this.siteType === undefined) {
      this.siteType = `site_type:${siteTypes}`;
      return this;
    }
    //If siteType value was set and trying to or then
    else {
      this.siteType += " AND " + `site_type:${siteTypes}`;
      return this;
    }
  }

  public orSiteTypes(siteTypes: string): this;
  public orSiteTypes(siteTypes: string[]): this;

  //Method overloading
  public orSiteTypes(siteTypes: string[] | string) {
    if (Array.isArray(siteTypes)) {
      if (siteTypes.length < 1) {
        return this;
      }

      //This is the first time siteType is being initialize so
      if (this.siteType === undefined) {
        const refStr = siteTypes
          .map((siteType) => `site_type:${siteType}`)
          .join(" OR ");
        this.siteType = `(${refStr})`;
        return this;
      }
      //If lang value was set and trying to or then
      else {
        const refStr = `(${siteTypes
          .map((text) => `site_type:${text}`)
          .join(" OR ")})`;
        this.siteType += " OR " + refStr;
        return this;
      }
    }
    //If only one string
    //This is the first time lang is being initialize so
    if (this.siteType === undefined) {
      this.siteType = `site_type:${siteTypes}`;
      return this;
    }
    //If lang value was set and trying to or then
    else {
      this.siteType += " OR " + `site_type:${siteTypes}`;
      return this;
    }
  }

  public published(date: string) {
    this.filters.push(`published:${date}`);
    return this;
  }

  public category(category: string) {
    this.filters.push(`category:${category}`);
    return this;
  }

  public topoc(topic: string) {
    this.filters.push(`topic:${topic}`);
    return this;
  }

  public sortOrder(order: "asc" | "desc") {
    this.order = order;
    return this;
  }

  public sortBy(sortBy: "relevancy" | "published" | "replies_count") {
    this.sort = sortBy;
    return this;
  }

  public andForm(from: number) {
    this.from = from;
    return this;
  }

  public build(): IQuery {
    if (this.lang) {
      this.lang = `(${this.lang})`; //Make sure to close in bracket at final
      this.filters.push(this.lang);
    }

    if (this.text) {
      this.text = `(${this.text})`; //Make sure to close in bracket at final
      this.filters.push(this.text);
    }

    if (this.siteType) {
      this.siteType = `(${this.siteType})`;
      this.filters.push(this.siteType);
    }

    const filter = this.filters.map((filter) => filter).join(" ");

    const query: IQuery = { q: filter, size: this.size, order: this.order };
    if (this.sort) {
      query.sort = this.sort;
    }

    return query;
  }
}
