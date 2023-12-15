import { expect, test } from "bun:test";
import { yundict, TEST_PROJECT_NAME, TEST_TEAM_NAME } from "./client";

test("Fetch projects", async () => {
  const res = await yundict.projects.all({ team: TEST_TEAM_NAME });
  expect(res.success).toBe(true);
  expect(res.data).toBeInstanceOf(Array);
});

test("Fetch project", async () => {
  const res = await yundict.projects.get({ team: TEST_TEAM_NAME, project: TEST_PROJECT_NAME });
  expect(res.success).toBe(true);
  expect(res.data?.name).toBe(TEST_PROJECT_NAME);
});

test("Create project", async () => {
  const res = await yundict.projects.create({ team: TEST_TEAM_NAME }, {
    name: TEST_PROJECT_NAME,
    displayName: 'Test project',
    baseLanguageISO: 'en',
    languagesISO: ['zh', 'jp']
  })
  expect(res.success).toBe(false);
  expect(res.message).toBe('project already exist');
});

test("Update project", async () => {
  const res = await yundict.projects.update({ team: TEST_TEAM_NAME, project: TEST_PROJECT_NAME }, {
    displayName: "Test Team 2"
  });
  expect(res.success).toBe(true);
});

// test("Delete project", async () => {
//   const res = await yundict.projects.delete({ team: TEST_TEAM_NAME, project: TEST_PROJECT_NAME })
//   expect(res.success).toBe(true);
// });