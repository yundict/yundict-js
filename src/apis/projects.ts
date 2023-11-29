import Yundict from "..";
import { Project } from "../types/project";
import { APIResponse } from "../types/response";

interface ProjectResourceQuery {
  team: string,
  project: string
}

export default class Projects {

  client: Yundict;

  constructor(client: Yundict) {
    this.client = client;
  }

  async all({ team, page, limit }: { team: string, page?: number, limit?: number }) {
    const params = new URLSearchParams()
    if (page) params.append('page', page.toString())
    if (limit) params.append('limit', limit.toString())
    return await this.client.request(`/teams/${team}/projects${params.keys.length > 0 ? '?' + params.toString() : ''}`) as APIResponse<Project[]>;
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
}