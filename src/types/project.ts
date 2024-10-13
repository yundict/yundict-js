export interface Project {
  id: number;
  name: string;
  displayName: string;
  description?: any;
  baseLanguage: string;
  languages: string[];
  creatorId: number;
  modifierId: number;
  teamId: number;
  createdAt: string;
  updatedAt: string;
  keyTotal: number;
  stringTotal: number;
  completedKeyTotal: number;
  translatedStringTotal: number;
  untranslatedStringTotal: number;
  tags: string[];
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

export interface Attachment {
  id: number;
  type: "image";
  description?: string;
  url?: string;
}

export interface ProjectKeyDetail {
  name: string;
  tags?: string[];
  translations?: ProjectKeyTranslation[];
  createdAt: string;
  updatedAt: string;
  resource: Attachment;
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