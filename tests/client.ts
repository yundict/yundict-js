import Yundict from "../src";

// Load API token from environment variable
const API_TOKEN = process.env.YUNDICT_API_TOKEN;

if (!API_TOKEN) {
  throw new Error("API_TOKEN is not set");
}

export const yundict = new Yundict({
  apiToken: API_TOKEN
});
