import { ApiClient } from "../api-client";
import { APIResponse } from "../types/response";
import { Team } from "../types/";

export default class Teams {

  client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  async all() {
    return await this.client.request('/teams') as APIResponse<Team[]>;
  }

  async get(name: string) {
    return await this.client.request(`/teams/${name}`) as APIResponse<Team>;
  }

  async create(params: { name: string; displayName: string; }) {
    return await this.client.request(`/teams`, { method: 'POST', body: JSON.stringify(params) });
  }

  async update(name: string, params: {
    name?: string;
    displayName?: string;
    description?: string;
    baseLanguageISO?: string;
    languagesISO?: string[];
  }) {
    return await this.client.request(`/teams/${name}`, { method: 'PATCH', body: JSON.stringify(params) });
  }

  async delete(name: string) {
    return await this.client.request(`/teams/${name}`, { method: 'DELETE' }) as APIResponse
  }

  async members({ teamName }: { teamName: string }) {
    return await this.client.request(`/teams/${teamName}/members`) as APIResponse<{
      id: number;
      displayName: string;
      photo: string;
      role: string;
    }[]>
  }

  async updateMembers({ teamName, members }: { teamName: string; members: { memberId: number, role: string }[] }) {
    return await this.client.request(`/teams/${teamName}/members`, { method: 'PATCH', body: JSON.stringify({ members }) });
  }

  async deleteMember({ teamName, memberId }: { teamName: string; memberId: number }) {
    return await this.client.request(`/teams/${teamName}/members/${memberId}`, { method: 'DELETE' })
  }

  async resetInviteToken({ teamName }: { teamName: string }) {
    return await this.client.request(`/teams/${teamName}/resetInviteToken`, { method: 'PATCH' })
  }
}