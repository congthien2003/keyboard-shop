export type PostOverview = {
  id: number;
  title: string;
  titleVi: string;
  excerpt: string;
  excerptVi: string;
  date: string;
  image: string;
};

export type News = {
  id: string;
  images: string[] | undefined;
  published: boolean;
  viewCount: number | undefined;
  likeCount: number | undefined;
  timeReading: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  authorId: string | undefined;
  authorName: string | undefined;
  tags: string[];
  createdAt: Date;
  updatedAt: Date | undefined;
};

// ==================== API Types ====================

// News Translation
export type NewsTranslation = {
  lang: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
};

// News Data (from API)
export type NewsData = {
  id: string;
  image: string;
  published: boolean;
  slug: string;
  timeReading: number | null;
  authorId: string | null;
  categoryId: string | null;
  viewCount: number | null;
  likeCount: number | null;
  createdAt: string;
  updatedAt: string | null;
  // Current language fields (from list API)
  title?: string;
  excerpt?: string;
  content?: string;
  tags?: string[];
  // Vietnamese
  titleVi: string;
  excerptVi: string;
  contentVi: string;
  tagsVi: string[];
  // English
  titleEn?: string;
  excerptEn?: string;
  contentEn?: string;
  tagsEn?: string[];
};

// Create News Request
export type CreateNewsRequest = {
  image?: string;
  published?: boolean;
  timeReading?: number;
  authorId?: string | null;
  categoryId?: string | null;
  // Vietnamese (required)
  titleVi: string;
  excerptVi?: string;
  contentVi: string;
  tagsVi?: string[];
  // English (optional)
  titleEn?: string;
  excerptEn?: string;
  contentEn?: string;
  tagsEn?: string[];
};

// Update News Request
export type UpdateNewsRequest = Partial<CreateNewsRequest> & {
  titleVi: string;
  contentVi: string;
};

// News List Query Params
export type NewsListParams = {
  page?: number;
  limit?: number;
  published?: boolean;
  lang?: "vi" | "en";
};

// Pagination Response
export type PaginationData = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

// API Response Types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type NewsListResponse = ApiResponse<NewsData[]> & {
  pagination?: PaginationData;
};

export type NewsDetailResponse = ApiResponse<NewsData>;

export type NewsCreateResponse = ApiResponse<NewsData>;

export type NewsUpdateResponse = ApiResponse<NewsData>;

export type NewsDeleteResponse = ApiResponse<{ message: string }>;
