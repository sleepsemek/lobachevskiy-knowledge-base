export type Document = {
  document_id: string;
  title: string;
  is_actual: boolean;
  access_levels: string[];
  department_name: string;
  version_id: string;
  uploaded_by: string;
  upload_date: string;
  file_name: string;
  storage_key: string;
}

export type DocumentMeta = {
  title: string;
  department_id: number;
  category: string;
  access_levels: string[];
  tags: string[];
  comment: string;
}

export type FileTypes = {
  types: string[];
}

export type RelatedDocument = {
  document_id: string;
  title: string;
  department_id: number;
  upload_date: string;
  is_actual: boolean;
}
