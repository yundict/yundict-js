import Teams from "./apis/teams";
import { APIResponse } from "./types/response";

interface YundictConfig {
  apiToken: string,
}

const API_ENDPOINT = "http://8.130.25.130";

export default class Yundict {

  config: YundictConfig;

  // apis
  teams: Teams;

  constructor(config: YundictConfig) {
    this.config = config;
    this.teams = new Teams(this);
  }

  async request(path: string, options?: RequestInit) {
    const accessToken = this.config.apiToken;

    console.log(`[API] request ${API_ENDPOINT + path} | accessToken: ${accessToken?.slice(0, 10)}...`)

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

}