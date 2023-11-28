import { expect, test } from "bun:test";
import Yundict from "../src";

// Load API token from environment variable
const API_TOKEN = process.env.API_TOKEN || "";

let yundict = new Yundict({
  apiToken: API_TOKEN
});

test("Fetch teams", async () => {
  const res = await yundict.teams()
  expect(res.success).toBe(true);
  expect(res.data).toBeInstanceOf(Array);
});

test("Fetch team", async () => {
  const name = "cRFA5urX";
  const res = await yundict.team(name)
  console.log(res)
  expect(res.success).toBe(true);
  expect(res.data?.name).toBe(name);
});

test("Create team", async () => {
  const res = await yundict.createTeam({
    name: "test-team",
    displayName: "Test Team"
  });
  expect(res.success).toBe(true);
});

test("Update team", async () => {
  const name = "test-team";
  const res = await yundict.updateTeam(name, {
    displayName: "Test Team 2"
  });
  expect(res.success).toBe(true);
});

test("Delete team", async () => {
  const name = "test-team";
  const res = await yundict.deleteTeam(name);
  expect(res.success).toBe(true);
});