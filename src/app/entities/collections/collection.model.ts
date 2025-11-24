export type Collection = {
  id: string;
  name: string;
  created_at: string;
  documents_count: number;
  documents: CollectionDocument[];
}

export type CollectionDocument = {
  title: string;
  document_id: number;
  department_id: number;
  access_levels: string[];
  tags: string[];
  is_actual: boolean;
  upload_date: string;
}

export type CreateCollectionRequest = {
  name: string;
}
