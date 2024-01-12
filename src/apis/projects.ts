import { ApiClient } from "../api-client";
import { Project, ProjectResourceQuery } from "../types/project";
import { APIResponse } from "../types/response";

export default class Projects {

  client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  async all({ team, page, limit }: { team: string, page?: number, limit?: number }) {
    const params = new URLSearchParams()
    if (page) params.append('page', page.toString())
    if (limit) params.append('limit', limit.toString())
    return await this.client.request(`/teams/${team}/projects${params.size > 0 ? '?' + params.toString() : ''}`) as APIResponse<Project[]>;
  }

  async get({ team, project }: ProjectResourceQuery) {
    return await this.client.request(`/teams/${team}/projects/${project}`) as APIResponse<Project>;
  }

  async create({ team }: { team?: string }, data: {
    name: string;
    displayName: string;
    description?: string;
    baseLanguageISO: string;
    languagesISO: string[];
  }) {
    return await this.client.request(`/teams/${team}/projects`, { method: 'POST', body: JSON.stringify(data) });
  }

  async update({ team, project }: ProjectResourceQuery, data: {
    name?: string;
    displayName?: string;
    description?: string;
    baseLanguageISO?: string;
    languagesISO?: string[];
  }) {
    return await this.client.request(`/teams/${team}/projects/${project}`, { method: 'PATCH', body: JSON.stringify(data) });
  }

  async delete({ team, project }: ProjectResourceQuery) {
    return await this.client.request(`/teams/${team}/projects/${project}`, { method: 'DELETE' });
  }

  async tags(teamName: string, projectName: string) {
    return await this.client.request(`/teams/${teamName}/projects/${projectName}/keys/tags`) as APIResponse<string[]>;
  }
}