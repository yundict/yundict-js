import Yundict from "..";
import { Project, ProjectKey, ProjectResourceQuery } from "../types/project";
import { APIResponse } from "../types/response";

interface fetchProjectKeysParams {
  keyword?: string;
  tags?: string[];
  sort?: string;
  page?: number;
  limit?: number;
}

export default class Keys {

  client: Yundict;

  constructor(client: Yundict) {
    this.client = client;
  }

  async all({ team, project, ...args }: ProjectResourceQuery & fetchProjectKeysParams) {
    const { keyword, tags, sort, page = 1, limit = 20 } = args ?? {}
    const params = new URLSearchParams()
    if (keyword) params.append('keyword', keyword)
    if (tags) params.append('tags', tags.join(','))
    if (sort) params.append('sort', sort)
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    const res = await this.client.request(`/teams/${team}/projects/${project}/keys?${params.toString()}`);
    return res as APIResponse<{ keys: ProjectKey[], total: number }>;
  }

  async create({ team, project }: ProjectResourceQuery, data: ProjectKey) {
    return (await this.client.request(`/teams/${team}/projects/${project}/keys`, {
      method: 'POST',
      body: JSON.stringify(data)
    })) as APIResponse<ProjectKey[]>;
  }

  async update({ team, project, key }: ProjectResourceQuery & { key: string }, data: ProjectKey) {
    return (await this.client.request(`/teams/${team}/projects/${project}/keys/${key}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })) as APIResponse<ProjectKey>;
  }

  async delete({ team, project, key }: ProjectResourceQuery & { key: string }) {
    return (await this.client.request(`/teams/${team}/projects/${project}/keys/${key}`, { method: 'DELETE' })) as APIResponse;
  }

}