import { expect, test } from "bun:test";
import { Yundict } from "../src/main";
import { yundict } from "./client";

test("Initialize", () => {
  expect(yundict).toBeInstanceOf(Yundict);
  expect(yundict.config.token).toBe(process.env.YUNDICT_API_TOKEN!);
});