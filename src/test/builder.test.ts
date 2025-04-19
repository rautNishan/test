import { describe, expect, test } from "@jest/globals";
import { QueryBuilder } from "../builder/query.builder";

describe("QueryBuilder", () => {
  test("should create basic query with constructor param", () => {
    const builder = new QueryBuilder("test query");
    const query = builder.build();

    expect(query).toEqual({
      q: "test query",
      size: 10,
      order: "asc",
    });
  });

  test("should add language filter with orLanguages", () => {
    const builder = new QueryBuilder("test query");
    const query = builder.orLanguages("en").build();

    expect(query).toEqual({
      q: "test query (language:en)",
      size: 10,
      order: "asc",
    });
  });

  test("should add multiple languages with orLanguages array", () => {
    const builder = new QueryBuilder("test query");
    const query = builder.orLanguages(["en", "fr", "es"]).build();

    expect(query).toEqual({
      q: "test query ((language:en OR language:fr OR language:es))",
      size: 10,
      order: "asc",
    });
  });

  test("should combine languages with andLanguages", () => {
    const builder = new QueryBuilder("test query");
    const query = builder.andLanguages(["en", "fr"]).build();

    expect(query).toEqual({
      q: "test query ((language:en AND language:fr))",
      size: 10,
      order: "asc",
    });
  });

  test("should set size properly", () => {
    const builder = new QueryBuilder("test query");
    const query = builder.setSize(25).build();

    expect(query).toEqual({
      q: "test query",
      size: 25,
      order: "asc",
    });
  });

  test("should add author filter", () => {
    const builder = new QueryBuilder("test query");
    const query = builder.author("John Doe").build();

    expect(query).toEqual({
      q: "test query author:John Doe",
      size: 10,
      order: "asc",
    });
  });

  test("should add sentiment filter", () => {
    const builder = new QueryBuilder("test query");
    const query = builder.sentiment("POSITIVE").build();

    expect(query).toEqual({
      q: "test query sentiment:POSITIVE",
      size: 10,
      order: "asc",
    });
  });

  test("should add text filters with andTexts", () => {
    const builder = new QueryBuilder("test query");
    const query = builder.andTexts(["climate", "change"]).build();

    expect(query).toEqual({
      q: "test query ((text:climate AND text:change))",
      size: 10,
      order: "asc",
    });
  });

  test("should add text filters with orTexts", () => {
    const builder = new QueryBuilder("test query");
    const query = builder.orTexts(["covid", "pandemic"]).build();

    expect(query).toEqual({
      q: "test query ((text:covid OR text:pandemic))",
      size: 10,
      order: "asc",
    });
  });

  test("should add site types with andSiteTypes", () => {
    const builder = new QueryBuilder("test query");
    const query = builder.andSiteTypes(["news", "blog"]).build();

    expect(query).toEqual({
      q: "test query ((site_type:news AND site_type:blog))",
      size: 10,
      order: "asc",
    });
  });

  test("should add site types with orSiteTypes", () => {
    const builder = new QueryBuilder("test query");
    const query = builder.orSiteTypes(["news", "blog"]).build();

    expect(query).toEqual({
      q: "test query ((site_type:news OR site_type:blog))",
      size: 10,
      order: "asc",
    });
  });

  test("should add published date filter", () => {
    const builder = new QueryBuilder("test query");
    const query = builder.published("2023-01-01").build();

    expect(query).toEqual({
      q: "test query published:2023-01-01",
      size: 10,
      order: "asc",
    });
  });

  test("should add category filter", () => {
    const builder = new QueryBuilder("test query");
    const query = builder.category("technology").build();

    expect(query).toEqual({
      q: "test query category:technology",
      size: 10,
      order: "asc",
    });
  });

  test("should change sort order", () => {
    const builder = new QueryBuilder("test query");
    const query = builder.sortOrder("desc").build();

    expect(query).toEqual({
      q: "test query",
      size: 10,
      order: "desc",
    });
  });

  test("should set sort by field", () => {
    const builder = new QueryBuilder("test query");
    const query = builder.sortBy("published").build();

    expect(query).toEqual({
      q: "test query",
      size: 10,
      order: "asc",
      sort: "published",
    });
  });

  test("should combine multiple filters", () => {
    const builder = new QueryBuilder("test query");
    const query = builder
      .orLanguages(["en", "fr"])
      .andTexts("climate")
      .orSiteTypes("news")
      .setSize(15)
      .sortBy("relevancy")
      .sortOrder("desc")
      .build();

    expect(query).toEqual({
      q: "test query ((language:en OR language:fr)) (text:climate) (site_type:news)",
      size: 15,
      order: "desc",
      sort: "relevancy",
    });
  });

  test("should handle chained method calls with orLanguages", () => {
    const builder = new QueryBuilder("test query");
    const query = builder.orLanguages("en").orLanguages("fr").build();

    expect(query).toEqual({
      q: "test query (language:en OR language:fr)",
      size: 10,
      order: "asc",
    });
  });

  test("should handle chained method calls with andLanguages", () => {
    const builder = new QueryBuilder("test query");
    const query = builder.andLanguages("en").andLanguages("fr").build();

    expect(query).toEqual({
      q: "test query (language:en AND language:fr)",
      size: 10,
      order: "asc",
    });
  });

  // Testing error case - empty array
  test("should handle empty arrays in filter methods", () => {
    const builder = new QueryBuilder("test query");
    const query = builder.orLanguages([]).andTexts([]).build();

    expect(query).toEqual({
      q: "test query",
      size: 10,
      order: "asc",
    });
  });
});
