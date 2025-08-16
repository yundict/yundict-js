import { expect, test } from "bun:test";
import { yundict } from "./client";
import { TEST_CONFIG } from "./test-config";

// Note: We use an existing test team "test-team" to avoid creating/deleting teams unnecessarily

test("Fetch teams", async () => {
	const res = await yundict.teams.all();
	expect(res.success).toBe(true);
	expect(res.data).toBeInstanceOf(Array);
});

test("Fetch team", async () => {
	const res = await yundict.teams.get(TEST_CONFIG.TEAM_NAME);
	if (!res.success) console.error(res);
	expect(res.success).toBe(true);
	expect(res.data?.name).toBe(TEST_CONFIG.TEAM_NAME);
});

test("Update team", async () => {
	// Get current display name first
	const currentRes = await yundict.teams.get(TEST_CONFIG.TEAM_NAME);
	const originalDisplayName = currentRes.data?.displayName;

	const res = await yundict.teams.update(TEST_CONFIG.TEAM_NAME, {
		displayName: "Test Team Updated",
	});
	if (!res.success) console.error(res);
	expect(res.success).toBe(true);

	// Restore original display name
	if (originalDisplayName) {
		await yundict.teams.update(TEST_CONFIG.TEAM_NAME, {
			displayName: originalDisplayName,
		});
	}
});

test("Fetch team members", async () => {
	const res = await yundict.teams.members(TEST_CONFIG.TEAM_NAME, { page: 1 });
	if (!res.success) console.error(res);
	expect(res.success).toBe(true);
	expect(res.data?.users).toBeInstanceOf(Array);
	expect(res.data?.total).toBeNumber();
});

test("Reset team invite token", async () => {
	const res = await yundict.teams.resetInviteToken({
		teamName: TEST_CONFIG.TEAM_NAME,
	});
	if (!res.success) console.error(res);
	expect(res.success).toBe(true);
});
