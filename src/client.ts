import { ApiClient, DefaultApiClient } from "./api-client";
import Keys from "./apis/keys";
import Projects from "./apis/projects";
import Teams from "./apis/teams";

/**
 * Yundict API Client Config
 */
export interface YundictConfig {

  /**
   * Yundict API Token
   */
  token: string;

  /**
   * Yundict API Endpoint
   * 
   * @default https://api.yundict.com
   */
  endpoint?: string;

  /**
   * Request
   */
  request?: {

    /**
     * Custom replacement for built-in fetch method. Useful for testing or request hooks.
     */
    fetch?: typeof fetch;

    /**
     * Custom headers to pass to every request
     */
    headers?: Record<string, string>;
  }
}

/**
 * Yundict API Client
 */
export class Yundict {

  /**
   * API Endpoint
   */
  API_ENDPOINT_DEFAULT = "https://api.yundict.com";

  /**
   * API Client Config
   */
  config: YundictConfig;

  // apis
  teams: Teams;
  projects: Projects;
  keys: Keys;

  apiClient: ApiClient

  /**
   * Create a new API Client
   * @param config API Client Config
   */
  constructor(config: YundictConfig) {
    this.config = config;
    if (!this.config.endpoint) {
      this.config.endpoint = this.API_ENDPOINT_DEFAULT;
    }

    this.apiClient = new DefaultApiClient(this.config);
    this.teams = new Teams(this.apiClient);
    this.projects = new Projects(this.apiClient);
    this.keys = new Keys(this.apiClient);
  }

}