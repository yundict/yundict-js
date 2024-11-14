import { Yundict } from "../src/main";

// Load API token from environment variable
const API_TOKEN = process.env.YUNDICT_API_TOKEN;
const API_ENDPOINT = process.env.YUNDICT_API_ENDPOINT;

if (!API_TOKEN) {
	throw new Error("API_TOKEN is not set");
}

export const yundict = new Yundict({
	token: API_TOKEN,
	endpoint: API_ENDPOINT,
});
