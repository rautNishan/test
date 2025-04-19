import { pool } from "./database.connection";

export async function migration() {
  const client = await pool.connect();

  //No any constraints because the constrainst are unknown
  //Create threade table
  try {
    await client.query(`CREATE TABLE IF NOT EXISTS threads (
    uuid UUID PRIMARY KEY, 
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
          uuid UUID PRIMARY KEY,
          thread_uuid UUID REFERENCES threads(uuid),
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
