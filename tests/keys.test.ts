import { expect, test, beforeAll } from "bun:test";
import { yundict } from "./client";

const TEST_TEAM_NAME = crypto.randomUUID().replace(/-/g, '');
const TEST_PROJECT_NAME = crypto.randomUUID().replace(/-/g, '');
const TEST_KEY_NAME = crypto.randomUUID().replace(/-/g, '');

// Create test team and project
beforeAll(async () => {
  await yundict.teams.create({
    name: TEST_TEAM_NAME,
    displayName: "Test Team"
  });
  await yundict.projects.create(TEST_TEAM_NAME, {
    name: TEST_PROJECT_NAME,
    displayName: 'Test project',
    baseLanguageISO: 'en',
    languagesISO: ['zh', 'jp']
  })
});

test("Fetch all keys", async () => {
  const res = await yundict.keys.all(TEST_TEAM_NAME, TEST_PROJECT_NAME)
  expect(res.success).toBeTrue()
  expect(res).toHaveProperty("data");
  expect(res.data?.keys).toBeArray();
  expect(res.data?.total).toBeNumber();
});

test("Create key", async () => {
  const data = {
    name: TEST_KEY_NAME,
    tags: ['test-tag'],
    translations: [
      {
        languageISO: 'en',
        content: 'Hello'
      }
    ]
  };
  const res = await yundict.keys.create(TEST_TEAM_NAME, TEST_PROJECT_NAME, data)
  expect(res.success).toBeTrue();
  expect(res.data).toMatchObject(data);
});

test("Update key", async () => {
  const res = await yundict.keys.update(TEST_TEAM_NAME, TEST_PROJECT_NAME, TEST_KEY_NAME, {
    name: TEST_KEY_NAME,
    tags: ['testTag']
  })
  expect(res.success).toBeTrue();
  expect(res.data?.tags).toContain('testTag');
});

test("Import Keys", async () => {
  const res = await yundict.keys.import(TEST_TEAM_NAME, TEST_PROJECT_NAME, {
    language: 'zh',
    tags: ['taga', 'tagb'],
    overwrite: true,
    file: new Blob([JSON.stringify({
      [TEST_KEY_NAME]: "你好"
    })], {
      type: "application/json"
    }),
    fileName: "test.json"
  });
  expect(res.success).toBeTrue();
  expect(res.data?.total).toBe(1);
});

test("Export keys", async () => {
  const res = await yundict.keys.export(TEST_TEAM_NAME, TEST_PROJECT_NAME, {
    type: "json",
    languages: ['en'],
  })
  expect(res.success).toBeTrue();
  expect(res.data).toStartWith("http");
});

test("Delete key", async () => {
  const res = await yundict.keys.delete(TEST_TEAM_NAME, TEST_PROJECT_NAME, TEST_KEY_NAME)
  expect(res.success).toBeTrue();
});