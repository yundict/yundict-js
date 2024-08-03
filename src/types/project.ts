export interface Project {
  id: string;
  name: string;
  displayName: string;
  description: string;
  baseLanguage: string;
  languages: string[];
  createdAt: string;
  updatedAt: string;
  creatorId: number;
  modifierId: number;
  keyTotal: number;
  stringTotal: number;
  translationTotal: number;
}

export interface ProjectKeyTranslation {
  language: string;
  content: string;
  contentDraft?: string;
}

export interface ProjectKey {
  name: string;
  tags?: string[];
  translations?: ProjectKeyTranslation[];
}

export type FetchProjectKeysParams = {
  keyword?: string;
  tags?: string[];
  sort?: string;
  page?: number;
  limit?: number;
};

/**
 * Export file type
 */
export type ExportFileType =
  | "key-value-json"
  | "apple-strings"
  | "android-xml"
  | "csv"
  | "arb"
  | "yaml"
  | "properties"
  | "ini"
  | "excel-xlsx"
  | "i18next-json";