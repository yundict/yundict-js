import { expect, test } from "bun:test";
import { yundict } from "./client";

test("Fetch teams", async () => {
  const res = await yundict.teams.all()
  expect(res.success).toBe(true);
  expect(res.data).toBeInstanceOf(Array);
});

test("Fetch team", async () => {
  const name = "cRFA5urX";
  const res = await yundict.teams.get(name)
  expect(res.success).toBe(true);
  expect(res.data?.name).toBe(name);
});

// test("Create team", async () => {
//   const res = await yundict.teams.create({
//     name: "test-team",
//     displayName: "Test Team"
//   });
//   expect(res.success).toBe(true);
// });

test("Update team", async () => {
  const name = "test-team";
  const res = await yundict.teams.update(name, {
    displayName: "Test Team 2"
  });
  expect(res.success).toBe(true);
});

// test("Delete team", async () => {
//   const name = "test-team";
//   const res = await yundict.teams.delete(name);
//   expect(res.success).toBe(true);
// });