import { ApiClient } from "../api-client";
import { Project } from "../types/project";
import { APIResponse } from "../types/response";

/**
 * Projects API
 */
export default class Projects {

  client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * Fetch all projects that the user has access to.
   * 
   * @param teamName The name of the team to fetch projects for.
   * @param page The page number to fetch.
   * @param limit The number of projects to fetch per page.
   * @returns Project list
   */
  async all(teamName: string, options: { page?: number, limit?: number } = {}) {
    const { page, limit } = options ?? {}
    const params = new URLSearchParams()
    if (page) params.append('page', page.toString())
    if (limit) params.append('limit', limit.toString())
    return await this.client.request(`/teams/${teamName}/projects${params.size > 0 ? '?' + params.toString() : ''}`) as APIResponse<Project[]>;
  }

  /**
   * Fetch a single project by name.
   * 
   * @param teamName The name of the team to fetch the project for.
   * @param projectName The name of the project to fetch.
   * @returns project details
   */
  async get(teamName: string, projectName: string) {
    return await this.client.request(`/teams/${teamName}/projects/${projectName}`) as APIResponse<Project>;
  }

  /**
   * Create a new project.
   * 
   * @param teamName The name of the team to create the project for.
   * @param data The project data.
   * @returns project details
   */
  async create(teamName: string, data: {
    name: string;
    displayName: string;
    description?: string;
    baseLanguageISO: string;
    languagesISO: string[];
  }) {
    return await this.client.request(`/teams/${teamName}/projects`, { method: 'POST', body: JSON.stringify(data) });
  }

  /**
   * Update a project.
   * 
   * @param teamName
   * @param data 
   * @returns 
   */
  async update(teamName: string, projectName: string, data: {
    name?: string;
    displayName?: string;
    description?: string;
    baseLanguageISO?: string;
    languagesISO?: string[];
  }) {
    return await this.client.request(`/teams/${teamName}/projects/${projectName}`, { method: 'PATCH', body: JSON.stringify(data) });
  }

  async delete(teamName: string, projectName: string) {
    return await this.client.request(`/teams/${teamName}/projects/${projectName}`, { method: 'DELETE' });
  }

  async tags(teamName: string, projectName: string) {
    return await this.client.request(`/teams/${teamName}/projects/${projectName}/keys/tags`) as APIResponse<string[]>;
  }
}