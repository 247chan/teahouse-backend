export interface FeedQuery {
  page?: number;
  limit?: number;
  category?: 'ACADEMIC' | 'DORM' | 'SOCIAL' | 'GENERAL';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface FeedMessage {
  id: string;
  content: string;
  category: string;
  createdAt: string;
  // no authorId to maintain anonymity
}