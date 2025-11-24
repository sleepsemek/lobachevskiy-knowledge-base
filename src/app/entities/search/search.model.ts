export interface SearchRequest {
  query: string;
  date_from: string | null;
  date_to: string | null;
  department_ids: number[];
  file_types: string[];
  only_active: boolean;
}

export interface SearchResponse {
  query_id: string;
  answer: string;
  items: SearchResult[];
}

export interface SearchResult {
  document_id: string;
  title: string;
  snippet: string;
  is_actual: boolean;
  date: string;
}
