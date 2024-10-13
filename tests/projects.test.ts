import { expect, test, beforeAll } from "bun:test";
import { yundict } from "./client";

// Random project name
const TEST_TEAM_NAME = crypto.randomUUID().replace(/-/g, '');
const TEST_PROJECT_NAME = crypto.randomUUID().replace(/-/g, '');

// Create test team and project
beforeAll(async () => {
  const res = await yundict.teams.create({
    name: TEST_TEAM_NAME,
    displayName: "Test Team"
  });
  if (!res.success) console.error(res);
  expect(res.success).toBe(true);
});
console.log("Start test project: " + TEST_PROJECT_NAME);

test("Fetch projects", async () => {
  const res = await yundict.projects.all(TEST_TEAM_NAME);
  expect(res?.success).toBe(true);
  expect(res?.data).toBeInstanceOf(Array);

  // Delete test project if it exists
  const testProject = res.data?.find(proj => proj.name === TEST_PROJECT_NAME);
  if (testProject) {
    const delProjRes = await yundict.projects.delete(TEST_TEAM_NAME, TEST_PROJECT_NAME);
    expect(delProjRes.success).toBe(true);
  }
});

test("Create project", async () => {
  const res = await yundict.projects.create(TEST_TEAM_NAME, {
    name: TEST_PROJECT_NAME,
    displayName: 'Test project',
    baseLanguage: 'en',
    languages: ['zh', 'jp']
  })
  if (!res.success) console.error(res);
  expect(res.success).toBe(true);
});

test("Fetch project", async () => {
  const res = await yundict.projects.get(TEST_TEAM_NAME, TEST_PROJECT_NAME);
  expect(res.success).toBe(true);
  expect(res.data?.name).toBe(TEST_PROJECT_NAME);
});

test("Fetch recently projects", async () => {
  const res = await yundict.projects.recently(TEST_TEAM_NAME, TEST_PROJECT_NAME);
  expect(res.success).toBe(true);
  expect(res.data).toBeInstanceOf(Array);
});

test("Update project", async () => {
  const res = await yundict.projects.update(TEST_TEAM_NAME, TEST_PROJECT_NAME, {
    displayName: "Test Team 2"
  });
  expect(res.success).toBe(true);
});

test("Delete project", async () => {
  const res = await yundict.projects.delete(TEST_TEAM_NAME, TEST_PROJECT_NAME)
  expect(res.success).toBe(true);
});