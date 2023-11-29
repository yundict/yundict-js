import { expect, test } from "bun:test";
import Yundict from "../src";
import { yundict } from "./client";

test("Initialize", () => {
  expect(yundict).toBeInstanceOf(Yundict);
  expect(yundict.config.apiToken).toBe(process.env.YUNDICT_API_TOKEN!);
});