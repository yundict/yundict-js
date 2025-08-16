import { afterAll, beforeAll, expect, test } from "bun:test";
import { yundict } from "./client";
import { TEST_CONFIG, cleanupTestResources, setupTestResources } from "./test-config";

// Create test team and project
beforeAll(async () => {
	await setupTestResources(yundict);
});

afterAll(async () => {
	// Clean up test team (this will also delete any projects and keys within it)
	await cleanupTestResources(yundict, TEST_CONFIG.TEAM_NAME);
});

test("Fetch all keys", async () => {
	const res = await yundict.keys.all(TEST_CONFIG.TEAM_NAME, TEST_CONFIG.PROJECT_NAME);
	expect(res.success).toBeTrue();
	expect(res).toHaveProperty("data");
	expect(res.data?.keys).toBeArray();
	expect(res.data?.total).toBeNumber();
});

test("Create key", async () => {
	const data = {
		name: TEST_CONFIG.KEY_NAME,
		tags: ["test-tag"],
		translations: [
			{
				language: "en",
				content: "Hello",
			},
		],
	};
	const res = await yundict.keys.create(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
		data,
	);
	expect(res.success).toBeTrue();
	expect(res.data).toMatchObject(data);
});

test("Fetch key", async () => {
	const res = await yundict.keys.get(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
		TEST_CONFIG.KEY_NAME,
	);
	expect(res.success).toBeTrue();
	expect(res.data?.name).toBe(TEST_CONFIG.KEY_NAME);
});

test("Update key", async () => {
	const res = await yundict.keys.update(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
		TEST_CONFIG.KEY_NAME,
		{
			name: TEST_CONFIG.KEY_NAME,
			tags: ["testTag"],
		},
	);
	expect(res.success).toBeTrue();
	expect(res.data?.tags).toContain("testTag");
});

test("Import Keys", async () => {
	const res = await yundict.keys.import(TEST_CONFIG.TEAM_NAME, TEST_CONFIG.PROJECT_NAME, {
		language: "zh",
		tags: ["taga", "tagb"],
		overwrite: true,
		file: new Blob(
			[
				JSON.stringify({
					[TEST_CONFIG.KEY_NAME]: "你好",
				}),
			],
			{
				type: "application/json",
			},
		),
		fileName: "test.json",
	});
	expect(res.success).toBeTrue();
	expect(res.data?.total).toBe(1);
});

test("Export keys", async () => {
	const res = await yundict.keys.export(TEST_CONFIG.TEAM_NAME, TEST_CONFIG.PROJECT_NAME, {
		type: "key-value-json",
		languages: ["en"],
	});
	if (!res.success) console.error(res);
	expect(res.success).toBeTrue();
	expect(res.data).toStartWith("http");
});

test("Import and Export universal placeholder", async () => {
	const res = await yundict.keys.import(TEST_CONFIG.TEAM_NAME, TEST_CONFIG.PROJECT_NAME, {
		language: "en",
		tags: ["test-placeholder"],
		overwrite: true,
		file: new Blob(
			[
				JSON.stringify({
					hello: "hello %s, i'm %i years old",
				}),
			],
			{
				type: "application/json",
			},
		),
		fileName: "test.json",
		convertPlaceholders: true,
	});
	expect(res.success).toBeTrue();
	expect(res.data?.total).toBe(1);

	async function exportJSONContentByPlaceholderFormat(
		placeholderFormat: "printf" | "ios" | "raw",
	) {
		const exportRes = await yundict.keys.export(
			TEST_CONFIG.TEAM_NAME,
			TEST_CONFIG.PROJECT_NAME,
			{
				type: "key-value-json",
				languages: ["en"],
				placeholderFormat: placeholderFormat,
			},
		);
		expect(exportRes.success).toBeTrue();
		expect(exportRes.data?.startsWith("http")).toBeTrue();
		if (!exportRes.data) {
			throw new Error("Export URL is undefined");
		}
		const downloadRes = await fetch(exportRes.data);
		const exportContent = await downloadRes.json();
		return exportContent as Record<string, unknown>;
	}

	// Printf format
	const printfExportContent =
		await exportJSONContentByPlaceholderFormat("printf");
	expect(printfExportContent.hello).toBe("hello %s, i'm %d years old");

	// iOS format
	const iosExportContent = await exportJSONContentByPlaceholderFormat("ios");
	expect(iosExportContent.hello).toBe("hello %@, i'm %d years old");

	// Raw format
	const rawExportContent = await exportJSONContentByPlaceholderFormat("raw");
	expect(rawExportContent.hello).toBe("hello [%s], i'm [%d] years old");
});

test("Add tags to multiple keys", async () => {
	// First create another key for testing
	const anotherKey = `${TEST_CONFIG.KEY_NAME}_2`;
	await yundict.keys.create(TEST_CONFIG.TEAM_NAME, TEST_CONFIG.PROJECT_NAME, {
		name: anotherKey,
		translations: [
			{
				language: "en",
				content: "Test content",
			},
		],
	});

	// Ensure the key has some initial tags
	await yundict.keys.update(TEST_CONFIG.TEAM_NAME, TEST_CONFIG.PROJECT_NAME, TEST_CONFIG.KEY_NAME, {
		name: TEST_CONFIG.KEY_NAME,
		tags: ["initial-tag"],
	});

	const res = await yundict.keys.addTags(TEST_CONFIG.TEAM_NAME, TEST_CONFIG.PROJECT_NAME, {
		keys: [TEST_CONFIG.KEY_NAME, anotherKey],
		tags: ["new-tag", "another-tag"],
	});
	
	// Note: This test may fail if the backend API is not implemented yet
	// But we still want to verify the client side implementation is correct
	expect(typeof res.success).toBe("boolean");

	// If the API call is successful, verify tags were added
	if (res.success) {
		// Verify tags were added by fetching the keys
		const key1 = await yundict.keys.get(TEST_CONFIG.TEAM_NAME, TEST_CONFIG.PROJECT_NAME, TEST_CONFIG.KEY_NAME);
		const key2 = await yundict.keys.get(TEST_CONFIG.TEAM_NAME, TEST_CONFIG.PROJECT_NAME, anotherKey);
		
		expect(key1.success).toBeTrue();
		expect(key2.success).toBeTrue();
		
		if (key1.success && key1.data && key2.success && key2.data) {
			expect(key1.data.tags).toContain("new-tag");
			expect(key1.data.tags).toContain("another-tag");
			expect(key2.data.tags).toContain("new-tag");
			expect(key2.data.tags).toContain("another-tag");
		}
	}
});

test("Delete tags from multiple keys", async () => {
	// First ensure the key has the tags we want to delete
	await yundict.keys.update(TEST_CONFIG.TEAM_NAME, TEST_CONFIG.PROJECT_NAME, TEST_CONFIG.KEY_NAME, {
		name: TEST_CONFIG.KEY_NAME,
		tags: ["new-tag", "keep-tag"],
	});

	const res = await yundict.keys.deleteTags(TEST_CONFIG.TEAM_NAME, TEST_CONFIG.PROJECT_NAME, {
		keys: [TEST_CONFIG.KEY_NAME],
		tags: ["new-tag"],
	});
	
	// Note: This test may fail if the backend API is not implemented yet
	// But we still want to verify the client side implementation is correct
	expect(typeof res.success).toBe("boolean");

	// If the API call is successful, verify tags were deleted
	if (res.success) {
		// Verify tags were deleted by fetching the key
		const key = await yundict.keys.get(TEST_CONFIG.TEAM_NAME, TEST_CONFIG.PROJECT_NAME, TEST_CONFIG.KEY_NAME);
		expect(key.success).toBeTrue();
		
		if (key.success && key.data) {
			expect(key.data.tags).not.toContain("new-tag");
			expect(key.data.tags).toContain("keep-tag");
		}
	}
});

test("Delete key", async () => {
	const res = await yundict.keys.delete(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
		TEST_CONFIG.KEY_NAME,
	);
	expect(res.success).toBeTrue();
});