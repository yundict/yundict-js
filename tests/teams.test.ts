import { expect, test } from "bun:test";
import { yundict } from "./client";

// Random team name
const TEST_TEAM_NAME = crypto.randomUUID().replace(/-/g, "").substring(0, 10);

test("Fetch teams", async () => {
	const res = await yundict.teams.all();
	expect(res.success).toBe(true);
	expect(res.data).toBeInstanceOf(Array);

	// Delete test team if it exists
	const testTeam = res.data?.find((team) => team.name === TEST_TEAM_NAME);
	if (testTeam) {
		const deleteTeamRes = await yundict.teams.delete(testTeam.name);
		expect(deleteTeamRes.success).toBe(true);
	}
});

test("Create team", async () => {
	const TEST_TEAM_DISPLAY_NAME = "Test Team";
	const res = await yundict.teams.create({
		name: TEST_TEAM_NAME,
		displayName: TEST_TEAM_DISPLAY_NAME,
	});
	if (!res.success) console.error(res);
	expect(res.success).toBe(true);
	expect(res.data?.name).toBe(TEST_TEAM_NAME);
	expect(res.data?.displayName).toBe(TEST_TEAM_DISPLAY_NAME);
});

test("Fetch team", async () => {
	const res = await yundict.teams.get(TEST_TEAM_NAME);
	if (!res.success) console.error(res);
	expect(res.success).toBe(true);
	expect(res.data?.name).toBe(TEST_TEAM_NAME);
});

test("Update team", async () => {
	const res = await yundict.teams.update(TEST_TEAM_NAME, {
		displayName: "Test Team Yo~",
	});
	if (!res.success) console.error(res);
	expect(res.success).toBe(true);
});

test("Fetch team members", async () => {
	const res = await yundict.teams.members(TEST_TEAM_NAME, { page: 2 });
	if (!res.success) console.error(res);
	expect(res.success).toBe(true);
	expect(res.data?.users).toBeInstanceOf(Array);
	expect(res.data?.total).toBeNumber();
});

test("Reset team invite token", async () => {
	const res = await yundict.teams.resetInviteToken({
		teamName: TEST_TEAM_NAME,
	});
	if (!res.success) console.error(res);
	expect(res.success).toBe(true);
});

test("Delete team", async () => {
	const name = TEST_TEAM_NAME;
	const res = await yundict.teams.delete(name);
	expect(res.success).toBe(true);
});
