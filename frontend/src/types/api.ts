// Common API response types

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
  correlationId?: string;
  timestamp: string;
  requestId?: string;
  meta?: {
    errorCode?: string;
    errorType?: string;
    documentationUrl?: string;
    requestId?: string;
    responseTime?: number;
    version?: string;
  };
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
  };
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
}
