import { APIResponse } from "./types/response";
import Team from "./types/team";

interface YundictConfig {
  apiToken: string,
}

const API_ENDPOINT = "http://api.yundict.com";

export default class Yundict {

  config: YundictConfig;

  constructor(config: YundictConfig) {
    this.config = config;
  }

  async request(path: string, options?: RequestInit) {
    const accessToken = this.config.apiToken;

    console.log(`[API] request ${API_ENDPOINT + path} | accessToken: ${accessToken?.slice(0, 20)}...`)

    if (!accessToken) {
      return Promise.reject(new Error('No access token'))
    }

    const res = await fetch(API_ENDPOINT + path, {
      ...options,
      headers: {
        ...options?.headers,
        // Authorization: `Bearer ${accessToken}`,
        "x-api-token": accessToken,
        "Content-Type": "application/json"
      },
    });

    // DELETE 请求不需要返回 body，根据错误码判断是否成功
    if (options?.method === 'DELETE' && res.status >= 200 && res.status < 300) {
      return { success: true }
    }

    return await res.json() as APIResponse
  }

  async teams() {
    return await this.request('/teams') as APIResponse<Team[]>;
  }

  async team(name: string) {
    return await this.request(`/teams/${name}`) as APIResponse<Team>;
  }

  async createTeam(params: { name: string; displayName: string; }) {
    return await this.request(`/teams`, { method: 'POST', body: JSON.stringify(params) });
  }

  async updateTeam(name: string, params: {
    displayName?: string;
    description?: string;
    baseLanguageISO?: string;
    languagesISO?: string[];
  }) {
    return await this.request(`/teams/${name}`, { method: 'PATCH', body: JSON.stringify(params) });
  }

  async deleteTeam(name: string) {
    return await this.request(`/teams/${name}`, { method: 'DELETE' }) as APIResponse
  }
}