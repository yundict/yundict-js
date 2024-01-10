export interface Project {
  id: string;
  name: string;
  displayName: string;
  description: string;
  baseLanguageISO: string;
  languagesISO: string[];
  createdAt: string;
  updatedAt: string;
  creatorId: number;
  modifierId: number;
  keyTotal: number;
  stringTotal: number;
  translationTotal: number;
}

export interface ProjectKeyTranslation {
  languageISO: string;
  content: string;
  contentDraft?: string;
}

export interface ProjectKey {
  name: string;
  tags?: string[];
  translations?: ProjectKeyTranslation[];
}

export interface ProjectResourceQuery {
  team: string,
  project: string
}