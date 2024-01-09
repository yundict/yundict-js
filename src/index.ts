import Keys from "./apis/keys";
import Projects from "./apis/projects";
import Teams from "./apis/teams";
import { APIResponse } from "./types/response";

/**
 * Yundict API Client Config
 */
export interface YundictConfig {

  /**
   * API Token
   */
  apiToken: string,
}

/**
 * Yundict API Client
 */
export default class Yundict {

  /**
   * API Endpoint
   */
  API_ENDPOINT = "https://api.yundict.com";

  /**
   * API Client Config
   */
  config: YundictConfig;

  // apis
  teams: Teams;
  projects: Projects;
  keys: Keys;

  /**
   * Create a new API Client
   * @param config API Client Config
   */
  constructor(config: YundictConfig) {
    this.config = config;
    this.teams = new Teams(this);
    this.projects = new Projects(this);
    this.keys = new Keys(this);
  }

  async request(path: string, options?: RequestInit) {
    const apiToken = this.config.apiToken;

    console.log(`[API] request ${this.API_ENDPOINT + path}`)

    if (!apiToken) {
      return Promise.reject(new Error('No access token'))
    }

    let headers = new Headers(options?.headers);

    // Content-Type
    if (options?.body && typeof options.body === 'string') {
      headers.append("Content-Type", "application/json");
    }

    // x-api-token
    if (apiToken) {
      headers.append("x-api-token", apiToken);
    }

    const res = await fetch(this.API_ENDPOINT + path, {
      ...options,
      headers
    });

    // DELETE request does not need to return body, judge whether it is successful according to the error code
    if (options?.method === 'DELETE' && res.status >= 200 && res.status < 300) {
      return { success: true }
    }

    return await res.json() as APIResponse
  }

}