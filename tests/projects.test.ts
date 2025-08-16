import { beforeAll, expect, test } from "bun:test";
import { yundict } from "./client";
import { setupTestResources, TEST_CONFIG } from "./test-config";

// Create test team and project
beforeAll(async () => {
	console.log(
		`Setting up test environment for project: ${TEST_CONFIG.PROJECT_NAME}`,
	);
	await setupTestResources(yundict);
});

// Note: We don't clean up the existing test project as it's a shared resource

test("Fetch projects", async () => {
	const res = await yundict.projects.all(TEST_CONFIG.TEAM_NAME);
	expect(res?.success).toBe(true);
	expect(res?.data).toBeInstanceOf(Array);

	// Verify our test project exists
	const testProject = res.data?.find(
		(proj) => proj.name === TEST_CONFIG.PROJECT_NAME,
	);
	expect(testProject).toBeDefined();
});

test("Fetch project", async () => {
	const res = await yundict.projects.get(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
	);
	expect(res.success).toBe(true);
	expect(res.data?.name).toBe(TEST_CONFIG.PROJECT_NAME);
});

test("Fetch recently projects", async () => {
	const res = await yundict.projects.recently(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
	);
	expect(res.success).toBe(true);
	expect(res.data).toBeInstanceOf(Array);
});

test("Fetch projects with pagination", async () => {
	const res = await yundict.projects.all(TEST_CONFIG.TEAM_NAME, {
		page: 1,
		limit: 10,
	});
	expect(res?.success).toBe(true);
	expect(res?.data).toBeInstanceOf(Array);
	expect(Array.isArray(res.data)).toBe(true);
});

test("Fetch project tags", async () => {
	const res = await yundict.projects.tags(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
	);
	expect(res.success).toBe(true);
	expect(res.data).toBeInstanceOf(Array);
});

test("Create and delete test project", async () => {
	// Skip this test if we're on a free plan with project limit
	const testProjectName = `temp-test-project-${Date.now()}`;
	const projectData = {
		name: testProjectName,
		displayName: "Temporary Test Project",
		description: "A temporary project for testing purposes",
		baseLanguage: "en",
		languages: ["zh", "jp"],
	};

	// Create project
	const createRes = await yundict.projects.create(
		TEST_CONFIG.TEAM_NAME,
		projectData,
	);

	if (!createRes.success && createRes.message?.includes("no more than")) {
		// Skip test if hit project limit on free plan
		console.log("Skipping project creation test due to plan limits");
		return;
	}

	expect(createRes.success).toBe(true);

	// Verify project was created by fetching it
	const getRes = await yundict.projects.get(
		TEST_CONFIG.TEAM_NAME,
		testProjectName,
	);
	expect(getRes.success).toBe(true);
	expect(getRes.data?.name).toBe(testProjectName);
	expect(getRes.data?.displayName).toBe(projectData.displayName);
	expect(getRes.data?.description).toBe(projectData.description);
	expect(getRes.data?.baseLanguage).toBe(projectData.baseLanguage);
	expect(getRes.data?.languages).toEqual(projectData.languages);

	// Clean up - delete the test project
	const deleteRes = await yundict.projects.delete(
		TEST_CONFIG.TEAM_NAME,
		testProjectName,
	);
	expect(deleteRes.success).toBe(true);

	// Verify project was deleted
	const getDeletedRes = await yundict.projects.get(
		TEST_CONFIG.TEAM_NAME,
		testProjectName,
	);
	expect(getDeletedRes.success).toBe(false);
});

test("Update project", async () => {
	// Skip this test if we're on a free plan - we'll test with existing project
	const testProjectName = `temp-update-project-${Date.now()}`;
	const initialData = {
		name: testProjectName,
		displayName: "Initial Project Name",
		description: "Initial description",
		baseLanguage: "en",
		languages: ["zh"],
	};

	const createRes = await yundict.projects.create(
		TEST_CONFIG.TEAM_NAME,
		initialData,
	);

	if (!createRes.success && createRes.message?.includes("no more than")) {
		// Skip test if hit project limit on free plan
		console.log("Skipping project update test due to plan limits");
		return;
	}

	expect(createRes.success).toBe(true);

	// Update the project
	const updateData = {
		displayName: "Updated Project Name",
		description: "Updated description",
		languages: ["zh", "jp", "fr"],
	};

	const updateRes = await yundict.projects.update(
		TEST_CONFIG.TEAM_NAME,
		testProjectName,
		updateData,
	);
	expect(updateRes.success).toBe(true);

	// Verify the updates
	const getRes = await yundict.projects.get(
		TEST_CONFIG.TEAM_NAME,
		testProjectName,
	);
	expect(getRes.success).toBe(true);
	expect(getRes.data?.displayName).toBe(updateData.displayName);
	expect(getRes.data?.description).toBe(updateData.description);
	expect(getRes.data?.languages).toEqual(updateData.languages);

	// Clean up
	await yundict.projects.delete(TEST_CONFIG.TEAM_NAME, testProjectName);
});

test("Handle non-existent project", async () => {
	const nonExistentProject = "non-existent-project-name";
	const res = await yundict.projects.get(
		TEST_CONFIG.TEAM_NAME,
		nonExistentProject,
	);
	expect(res.success).toBe(false);
});

test("Handle non-existent team", async () => {
	const nonExistentTeam = "non-existent-team-name";
	const res = await yundict.projects.all(nonExistentTeam);
	expect(res?.success).toBe(false);
});

test("Validate project data structure", async () => {
	const res = await yundict.projects.get(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
	);
	expect(res.success).toBe(true);

	const project = res.data;
	expect(project).toBeDefined();

	// Check required fields
	expect(typeof project?.id).toBe("number");
	expect(typeof project?.name).toBe("string");
	expect(typeof project?.displayName).toBe("string");
	expect(typeof project?.baseLanguage).toBe("string");
	expect(Array.isArray(project?.languages)).toBe(true);
	expect(typeof project?.creatorId).toBe("string"); // creatorId is string, not number
	expect(typeof project?.modifierId).toBe("string"); // modifierId is string, not number
	expect(typeof project?.teamId).toBe("number");
	expect(typeof project?.createdAt).toBe("string");
	expect(typeof project?.updatedAt).toBe("string");
	expect(typeof project?.keyTotal).toBe("number");
	expect(typeof project?.stringTotal).toBe("number");
	expect(typeof project?.translatedStringTotal).toBe("number");
	expect(typeof project?.untranslatedStringTotal).toBe("number");
	expect(Array.isArray(project?.tags)).toBe(true);

	// Check optional fields
	if (project?.description !== null) {
		expect(typeof project?.description).toBe("string");
	}
});

test("Test API response format consistency", async () => {
	// Test that all project APIs return consistent response format
	const allRes = await yundict.projects.all(TEST_CONFIG.TEAM_NAME);
	expect(allRes).toHaveProperty("success");
	expect(allRes).toHaveProperty("data");
	if (!allRes.success) {
		expect(allRes).toHaveProperty("message");
	}

	const getRes = await yundict.projects.get(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
	);
	expect(getRes).toHaveProperty("success");
	expect(getRes).toHaveProperty("data");
	if (!getRes.success) {
		expect(getRes).toHaveProperty("message");
	}

	const recentlyRes = await yundict.projects.recently(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
	);
	expect(recentlyRes).toHaveProperty("success");
	expect(recentlyRes).toHaveProperty("data");
	if (!recentlyRes.success) {
		expect(recentlyRes).toHaveProperty("message");
	}

	const tagsRes = await yundict.projects.tags(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
	);
	expect(tagsRes).toHaveProperty("success");
	expect(tagsRes).toHaveProperty("data");
	if (!tagsRes.success) {
		expect(tagsRes).toHaveProperty("message");
	}
});

test("Test pagination parameters", async () => {
	// Test different pagination scenarios
	const res1 = await yundict.projects.all(TEST_CONFIG.TEAM_NAME, {
		page: 1,
		limit: 5,
	});
	expect(res1?.success).toBe(true);

	const res2 = await yundict.projects.all(TEST_CONFIG.TEAM_NAME, { page: 1 });
	expect(res2?.success).toBe(true);

	const res3 = await yundict.projects.all(TEST_CONFIG.TEAM_NAME, { limit: 10 });
	expect(res3?.success).toBe(true);

	// Test edge cases
	const res4 = await yundict.projects.all(TEST_CONFIG.TEAM_NAME, {
		page: 0,
		limit: 0,
	});
	expect(res4).toBeDefined(); // Should handle gracefully
});

test("Test project list filtering and search", async () => {
	const res = await yundict.projects.all(TEST_CONFIG.TEAM_NAME);
	expect(res?.success).toBe(true);
	expect(Array.isArray(res.data)).toBe(true);

	// Verify that our test project appears in the list
	const testProject = res.data?.find(
		(project) => project.name === TEST_CONFIG.PROJECT_NAME,
	);
	expect(testProject).toBeDefined();
	expect(testProject?.displayName).toBe(TEST_CONFIG.PROJECT_DISPLAY_NAME);
});

test("Test project statistics and metrics", async () => {
	const res = await yundict.projects.get(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
	);
	expect(res.success).toBe(true);

	const project = res.data;
	expect(project).toBeDefined();

	// Verify statistical fields are numbers and make sense
	expect(project?.keyTotal).toBeGreaterThanOrEqual(0);
	expect(project?.stringTotal).toBeGreaterThanOrEqual(0);
	expect(project?.translatedStringTotal).toBeGreaterThanOrEqual(0);
	expect(project?.untranslatedStringTotal).toBeGreaterThanOrEqual(0);

	// Basic sanity check: translated + untranslated should not exceed total
	const translatedAndUntranslated =
		(project?.translatedStringTotal || 0) +
		(project?.untranslatedStringTotal || 0);
	expect(translatedAndUntranslated).toBeLessThanOrEqual(
		project?.stringTotal || 0,
	);

	// Verify translations exist for multiple languages
	expect(project?.languages.length).toBeGreaterThan(0);
});
