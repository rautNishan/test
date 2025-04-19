export interface IThread {
  uuid: string;
  url: string;
  site_full: string;
  site: string;
  site_section: string;
  section_title: string;
  site_title: string;
  title: string;
  title_full: string;
  published: string;
  replies_count: number;
  participants_count: number;
  site_type: string;
  main_image: string;
  country: string;
  site_categories: string[];
  social: Record<string, any>;
  performance_score: number;
  domain_rank: number;
  domain_rank_updated: Date;
}

export interface IPost {
  uuid: string;
  thread_uuid: string;
  parent_url: string;
  ord_in_thread: number;
  author: string;
  published: string;
  title: string;
  text: string;
  highlightText: string;
  highlightTitle: string;
  highlightThreadTitle: string;
  language: string;
  sentiment: string;
  categories: string[];
  topics: Record<string, any>;
  ai_allow: boolean;
  has_canonical: boolean;
  webz_reporter: boolean;
  external_links: string[];
  external_images: string[];
  entities: Record<string, any>;
  syndication: Record<string, any>;
  trust: Record<string, any>;
  rating: number;
  crawled: string;
  updated: string;
  url: string;
}
