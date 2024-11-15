import type { YundictConfig } from "./client";
import type { APIResponse } from "./types/response";

/**
 * API Client Interface
 */
export interface ApiClient {
	/**
	 * Client configuration
	 */
	config: YundictConfig;

	/**
	 * Request
	 *
	 * @param path
	 * @param options
	 */
	request(path: string, options?: RequestInit): Promise<APIResponse>;
}

/**
 * Default API Client
 */
export class DefaultApiClient implements ApiClient {
	config: YundictConfig;

	constructor(config: YundictConfig) {
		this.config = config;
	}

	async request(path: string, options?: RequestInit) {
		const apiToken = this.config.token;

		const headers = new Headers(options?.headers);

		// Content-Type
		if (options?.body && typeof options.body === "string") {
			headers.append("Content-Type", "application/json");
		}

		// x-api-token
		if (apiToken) {
			headers.append("x-api-token", apiToken);
		}

		// Append custom headers
		const customHeaders = this.config?.request?.headers;
		for (const key in customHeaders) {
			customHeaders[key] && headers.append(key, customHeaders[key]);
		}

		// Merge options
		let currentOptions: RequestInit = {
			...options,
			headers,
		};

		// Before request hook
		if (this.config?.request?.beforeRequest) {
			currentOptions = await this.config.request.beforeRequest(
				path,
				currentOptions,
			);
		}

		const _fetch = this.config?.request?.fetch || fetch;
		const res = await _fetch(this.config.endpoint + path, currentOptions);

		// DELETE request does not need to return body, judge whether it is successful according to the error code
		if (options?.method === "DELETE" && res.status >= 200 && res.status < 300) {
			return { success: true };
		}

		return (await res.json()) as APIResponse;
	}
}
