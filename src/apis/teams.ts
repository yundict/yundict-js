import { ApiClient } from "../api-client";
import { APIResponse } from "../types/response";
import { Team } from "../types/";

/**
 * Teams API
 */
export default class Teams {

  client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * Fetch all teams that the user has access to.
   */
  async all() {
    return await this.client.request('/teams') as APIResponse<Team[]>;
  }

  /**
   * Fetch a team by name.
   */
  async get(name: string) {
    return await this.client.request(`/teams/${name}`) as APIResponse<Team>;
  }

  /**
   * Create a new team.
   */
  async create(params: { name: string; displayName: string; }) {
    return await this.client.request(`/teams`, { method: 'POST', body: JSON.stringify(params) });
  }

  /**
   * Update a team.
   * @param name The name of the team to update.
   * @param data The data to update.
   */
  async update(name: string, data: {
    name?: string;
    displayName?: string;
    description?: string;
    baseLanguageISO?: string;
    languagesISO?: string[];
  }) {
    return await this.client.request(`/teams/${name}`, { method: 'PATCH', body: JSON.stringify(data) });
  }

  /**
   * Delete a team by name.
   */
  async delete(name: string) {
    return await this.client.request(`/teams/${name}`, { method: 'DELETE' }) as APIResponse
  }

  /**
   * Fetch all members of a team.
   */
  async members(name: string) {
    return await this.client.request(`/teams/${name}/members`) as APIResponse<{
      id: number;
      displayName: string;
      photo: string;
      role: string;
    }[]>
  }

  /**
   * Update a member's role.
   */
  async updateMember({ teamName, memberId, role }: { teamName: string; memberId: number, role: string }) {
    return await this.client.request(`/teams/${teamName}/members`, {
      method: 'PATCH', body: JSON.stringify({
        memberId,
        role
      })
    });
  }

  /**
   * Delete a member from a team.
   */
  async deleteMember({ teamName, memberId }: { teamName: string; memberId: number }) {
    return await this.client.request(`/teams/${teamName}/members/${memberId}`, { method: 'DELETE' })
  }

  /**
   * Reset a team's invite token.
   */
  async resetInviteToken({ teamName }: { teamName: string }) {
    return await this.client.request(`/teams/${teamName}/resetInviteToken`, { method: 'PATCH' }) as APIResponse<string>
  }
}