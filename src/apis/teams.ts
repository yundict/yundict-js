import type { ApiClient } from "../api-client";
import type { Team, TeamMember } from "../types/";
import type { APIResponse } from "../types/response";

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
		return (await this.client.request("/teams")) as APIResponse<Team[]>;
	}

	/**
	 * Fetch a team by name.
	 */
	async get(name: string) {
		return (await this.client.request(`/teams/${name}`)) as APIResponse<Team>;
	}

	/**
	 * Create a new team.
	 */
	async create(params: { name: string; displayName: string }) {
		return (await this.client.request("/teams", {
			method: "POST",
			body: JSON.stringify(params),
		})) as APIResponse<Team>;
	}

	/**
	 * Update a team.
	 * @param name The name of the team to update.
	 * @param data The data to update.
	 */
	async update(
		name: string,
		data: {
			name?: string;
			displayName?: string;
			description?: string;
			baseLanguage?: string;
			languages?: string[];
		},
	) {
		return await this.client.request(`/teams/${name}`, {
			method: "PATCH",
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete a team by name.
	 */
	async delete(name: string) {
		return (await this.client.request(`/teams/${name}`, {
			method: "DELETE",
		})) as APIResponse;
	}

	/**
	 * Fetch all members of a team.
	 */
	async members(name: string, options?: { page?: number; limit?: number }) {
		const { page = 1, limit = 10 } = options ?? {};
		const params = new URLSearchParams();
		params.append("page", page.toString());
		params.append("limit", limit.toString());
		return (await this.client.request(
			`/teams/${name}/members?${params.toString()}`,
		)) as APIResponse<{
			users: TeamMember[];
			total: number;
		}>;
	}

	/**
	 * Update a member's role.
	 */
	async updateMember({
		teamName,
		memberId,
		role,
	}: {
		teamName: string;
		memberId: number;
		role: string;
	}) {
		return await this.client.request(`/teams/${teamName}/members`, {
			method: "PATCH",
			body: JSON.stringify({
				memberId,
				role,
			}),
		});
	}

	/**
	 * Delete a member from a team.
	 */
	async deleteMember({
		teamName,
		memberId,
	}: {
		teamName: string;
		memberId: number;
	}) {
		return await this.client.request(`/teams/${teamName}/members/${memberId}`, {
			method: "DELETE",
		});
	}

	/**
	 * Reset a team's invite token.
	 */
	async resetInviteToken({ teamName }: { teamName: string }) {
		return (await this.client.request(`/teams/${teamName}/resetInviteToken`, {
			method: "PATCH",
		})) as APIResponse<string>;
	}
}
