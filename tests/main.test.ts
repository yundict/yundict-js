import { expect, test } from "bun:test";
import { Yundict } from "../src/main";
import { yundict } from "./client";

test("Initialize", () => {
	expect(yundict).toBeInstanceOf(Yundict);

	if (!process.env.YUNDICT_API_TOKEN) {
		throw new Error("YUNDICT_API_TOKEN is not set");
	}
	expect(yundict.config.token).toBe(process.env.YUNDICT_API_TOKEN);
});
