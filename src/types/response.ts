export interface APIResponse<T = unknown> {
	success: boolean;
	data?: T;
	message?: string;
}
