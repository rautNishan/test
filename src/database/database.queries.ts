import { error } from "console";
import { pool } from "./database.connection";
import { IPost, IThread } from "./interfaces/database.interface";

export async function migration() {
  const client = await pool.connect();

  //No any constraints because the constrainst are unknown
  //Create threade table
  try {
    await client.query(`CREATE TABLE IF NOT EXISTS threads (
    uuid VARCHAR PRIMARY KEY,  
    url VARCHAR,
    site_full VARCHAR,
    site VARCHAR,
    site_section VARCHAR,
    section_title VARCHAR,
    site_title VARCHAR,
    title VARCHAR,
    title_full VARCHAR,
    published TIMESTAMPTZ,
    replies_count INTEGER,
    participants_count INTEGER,
    site_type VARCHAR,
    main_image VARCHAR,
    country VARCHAR,
    site_categories varchar[],
    social JSONB,
    performance_score INTEGER,
    domain_rank INTEGER,
    domain_rank_updated TIMESTAMPTZ
  );`);
    console.log("Threads Migration complete");

    // Create posts table
    await client.query(`
        CREATE TABLE IF NOT EXISTS posts (
          uuid VARCHAR(40) PRIMARY KEY, 
          thread_uuid VARCHAR REFERENCES threads(uuid),
          parent_url VARCHAR,
          ord_in_thread INTEGER,
          author VARCHAR,
          published TIMESTAMPTZ,
          title VARCHAR,
          text TEXT,
          highlightText TEXT,
          highlightTitle TEXT,
          highlightThreadTitle TEXT,
          language VARCHAR,
          sentiment VARCHAR,
          categories VARCHAR[],
          topics JSONB,
          ai_allow BOOLEAN,
          has_canonical BOOLEAN,
          webz_reporter BOOLEAN,
          external_links VARCHAR[],
          external_images VARCHAR[],
          entities JSONB,
          syndication JSONB,
          trust JSONB,
          rating INTEGER,
          crawled TIMESTAMPTZ,
          updated TIMESTAMPTZ,
          url VARCHAR
        );
      `);
    console.log("Post migration Complete");
  } catch (error) {
    throw error;
  } finally {
    await client.release();
  }
}

export async function insertIntoThreads(data: IThread, client: any) {
  try {
    const query = `
        INSERT INTO threads (
          uuid, url, site_full, site, site_section, section_title, site_title,
          title, title_full, published, replies_count, participants_count,
          site_type, main_image, country, site_categories, social,
          performance_score, domain_rank, domain_rank_updated
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
        )
        `;

    const values = [
      data.uuid,
      data.url,
      data.site_full,
      data.site,
      data.site_section,
      data.section_title,
      data.site_title,
      data.title,
      data.title_full,
      data.published,
      data.replies_count,
      data.participants_count,
      data.site_type,
      data.main_image,
      data.country,
      data.site_categories,
      data.social,
      data.performance_score,
      data.domain_rank,
      data.domain_rank_updated,
    ];
    return await client.query(query, values);
  } catch (error) {
    throw error;
  }
}

export async function insertIntoPost(data: IPost, client: any) {
  try {
    const query = `
        INSERT INTO posts (
          uuid, thread_uuid, parent_url, ord_in_thread, author, published,
          title, text, highlightText, highlightTitle, highlightThreadTitle,
          language, sentiment, categories, topics, ai_allow, has_canonical,
          webz_reporter, external_links, external_images, entities, syndication,
          trust, rating, crawled, updated, url
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
          $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27
        )
      `;

    const values = [
      data.uuid,
      data.thread_uuid,
      data.parent_url,
      data.ord_in_thread,
      data.author,
      data.published,
      data.title,
      data.text,
      data.highlightText,
      data.highlightTitle,
      data.highlightThreadTitle,
      data.language,
      data.sentiment,
      data.categories,
      JSON.stringify(data.topics),
      data.ai_allow,
      data.has_canonical,
      data.webz_reporter,
      data.external_links,
      data.external_images,
      JSON.stringify(data.entities),
      JSON.stringify(data.syndication),
      JSON.stringify(data.trust),
      data.rating,
      data.crawled,
      data.updated,
      data.url,
    ];
    return await client.query(query, values);
  } catch (error) {
    throw error;
  }
}
