import type { ApiClient } from "../api-client";
import type {
	ExportFileType,
	FetchProjectKeysParams,
	ProjectKey,
	ProjectKeyDetail,
} from "../types/project";
import type { APIResponse } from "../types/response";

/**
 * Keys API
 */
export default class Keys {
	client: ApiClient;

	constructor(client: ApiClient) {
		this.client = client;
	}

	/**
	 * Fetch all keys of a project
	 *
	 * @param teamName The name of the team
	 * @param projectName The name of the project
	 * @param options The options to fetch keys
	 * @returns
	 */
	async all(
		teamName: string,
		projectName: string,
		options: FetchProjectKeysParams = {},
	) {
		const { keyword, tags, sort, page = 1, limit = 20 } = options ?? {};
		const params = new URLSearchParams();
		if (keyword) params.append("keyword", keyword);
		if (tags) params.append("tags", tags.join(","));
		if (sort) params.append("sort", sort);
		params.append("page", page.toString());
		params.append("limit", limit.toString());
		const res = await this.client.request(
			`/teams/${teamName}/projects/${projectName}/keys?${params.toString()}`,
		);
		return res as APIResponse<{ keys: ProjectKey[]; total: number }>;
	}

	/**
	 * Fetch a key
	 *
	 * @param teamName The name of the team
	 * @param projectName The name of the project
	 * @param keyName The name of the key
	 * @returns
	 */
	async get(teamName: string, projectName: string, keyName: string) {
		return (await this.client.request(
			`/teams/${teamName}/projects/${projectName}/keys/${keyName}`,
		)) as APIResponse<ProjectKeyDetail>;
	}

	/**
	 * Create a new key
	 *
	 * @param teamName The name of the team
	 * @param projectName The name of the project
	 * @param data The data to create a new key
	 * @returns The created key
	 */
	async create(teamName: string, projectName: string, data: ProjectKey) {
		return (await this.client.request(
			`/teams/${teamName}/projects/${projectName}/keys`,
			{
				method: "POST",
				body: JSON.stringify(data),
			},
		)) as APIResponse<ProjectKey[]>;
	}

	/**
	 * Update a key
	 *
	 * @param teamName The name of the team
	 * @param projectName The name of the project
	 * @param keyName The name of the key
	 * @param data The data to update the key
	 */
	async update(
		teamName: string,
		projectName: string,
		keyName: string,
		data: ProjectKey,
	) {
		return (await this.client.request(
			`/teams/${teamName}/projects/${projectName}/keys/${keyName}`,
			{
				method: "PATCH",
				body: JSON.stringify(data),
			},
		)) as APIResponse<ProjectKey>;
	}

	/**
	 * Delete a key
	 *
	 * @param teamName The name of the team
	 * @param projectName The name of the project
	 * @param keyName The name of the key
	 * @returns Delete success or not
	 */
	async delete(teamName: string, projectName: string, keyName: string) {
		return (await this.client.request(
			`/teams/${teamName}/projects/${projectName}/keys/${keyName}`,
			{
				method: "DELETE",
			},
		)) as APIResponse;
	}

	/**
	 * Export keys
	 *
	 * @param teamName The name of the team
	 * @param projectName The name of the project
	 * @param options The options to export keys
	 * @returns The exported file url
	 */
	async export(
		teamName: string,
		projectName: string,
		options: {
			languages?: string[];
			tags?: string[];
			type: ExportFileType;
			placeholderFormat?: "printf" | "ios" | "raw";
		},
	) {
		const { languages, tags, type, placeholderFormat } = options ?? {};
		const params = new URLSearchParams();
		if (languages && languages.length > 0)
			params.append("languages", languages.join(","));
		if (tags && tags.length > 0) params.append("tags", tags.join(","));
		if (type) params.append("type", type);
		if (placeholderFormat)
			params.append("placeholderFormat", placeholderFormat);
		const res = await this.client.request(
			`/teams/${teamName}/projects/${projectName}/keys/export?${params.toString()}`,
		);
		return res as APIResponse<string>;
	}

	/**
	 * Import keys from a file
	 *
	 * @param teamName The name of the team
	 * @param projectName The name of the project
	 * @param language Which language to import
	 * @param file The file to import
	 * @param fileName The name of the file
	 * @param tags Add tags to the imported keys
	 * @param overwrite Overwrite the existing keys or not
	 * @returns Import success or not
	 */
	async import(
		teamName: string,
		projectName: string,
		{
			language,
			file,
			fileName,
			tags = [],
			overwrite = false,
			convertPlaceholders,
		}: {
			language: string;
			tags?: string[];
			overwrite?: boolean;
			file: File | Blob;
			fileName: string;
			convertPlaceholders?: boolean;
		},
	) {
		const formData = new FormData();
		formData.set("tags", tags.join(","));
		formData.set("language", language);
		formData.set("overwrite", overwrite.toString());
		formData.append("file", file, fileName);
		convertPlaceholders &&
			formData.set("convertPlaceholders", convertPlaceholders.toString());
		const res = await this.client.request(
			`/teams/${teamName}/projects/${projectName}/keys/import`,
			{
				method: "POST",
				body: formData,
			},
		);
		return res as APIResponse<{ total: number }>;
	}

	/**
	 * Fetch translation history of a key
	 */
	async history(
		teamName: string,
		projectName: string,
		keyName: string,
		{ language }: { language: string },
	) {
		const res = await this.client.request(
			`/teams/${teamName}/projects/${projectName}/keys/${keyName}/history?language=${language}`,
		);
		return res as APIResponse<
			{
				content: string;
				createdAt: string;
				user: {
					displayName: string;
					email: string;
					photo: string;
				};
			}[]
		>;
	}

	/**
	 * Add tags to multiple keys
	 *
	 * @param teamName The name of the team
	 * @param projectName The name of the project
	 * @param data The keys and tags to add
	 * @returns API response
	 */
	async addTags(
		teamName: string,
		projectName: string,
		data: {
			keys: string[];
			tags: string[];
		},
	) {
		return (await this.client.request(
			`/teams/${teamName}/projects/${projectName}/keys/tags`,
			{
				method: "PATCH",
				body: JSON.stringify(data),
			},
		)) as APIResponse;
	}

	/**
	 * Delete tags from multiple keys
	 *
	 * @param teamName The name of the team
	 * @param projectName The name of the project
	 * @param data The keys and tags to delete
	 * @returns API response
	 */
	async deleteTags(
		teamName: string,
		projectName: string,
		data: {
			keys: string[];
			tags: string[];
		},
	) {
		return (await this.client.request(
			`/teams/${teamName}/projects/${projectName}/keys/deleteTags`,
			{
				method: "PATCH",
				body: JSON.stringify(data),
			},
		)) as APIResponse;
	}
}
