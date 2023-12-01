import { expect, test } from "bun:test";
import { yundict } from "./client";

const TEST_TEAM_NAME = "cRFA5urX";
const TEST_PROJECT_NAME = "test-project";

test("Fetch all keys", async () => {
  const res = await yundict.keys.all({ team: TEST_TEAM_NAME, project: TEST_PROJECT_NAME })
  expect(res.success).toBeTrue()
  expect(res).toHaveProperty("data");
  expect(res.data?.keys).toBeArray();
  expect(res.data?.total).toBeNumber();
});

test("Create key", async () => {
  const res = await yundict.keys.create({ team: TEST_TEAM_NAME, project: TEST_PROJECT_NAME }, {
    name: "existed-key",
    translations: []
  })
  expect(res.success).toBeFalse();
});