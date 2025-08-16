import { afterAll, beforeAll, expect, test } from "bun:test";
import { yundict } from "./client";
import {
	cleanupTestResources,
	setupTestResources,
	TEST_CONFIG,
} from "./test-config";

// Create test team and project
beforeAll(async () => {
	await setupTestResources(yundict);
});

afterAll(async () => {
	// Clean up test team (this will also delete any projects and keys within it)
	await cleanupTestResources(yundict, TEST_CONFIG.TEAM_NAME);
});

test("Fetch all keys", async () => {
	const res = await yundict.keys.all(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
	);
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
	const res = await yundict.keys.import(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
		{
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
		},
	);
	expect(res.success).toBeTrue();
	expect(res.data?.total).toBe(1);
});

test("Export keys", async () => {
	const res = await yundict.keys.export(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
		{
			type: "key-value-json",
			languages: ["en"],
		},
	);
	if (!res.success) console.error(res);
	expect(res.success).toBeTrue();
	expect(res.data).toStartWith("http");
});

test("Import and Export universal placeholder", async () => {
	const res = await yundict.keys.import(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
		{
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
		},
	);
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
	// First create the main test key if it doesn't exist
	const mainKey = `${TEST_CONFIG.KEY_NAME}_add_tags_main_${Date.now()}`;
	const createMainRes = await yundict.keys.create(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
		{
			name: mainKey,
			translations: [
				{
					language: "en",
					content: "Main test content",
				},
			],
			tags: ["initial-tag", "new-tag", "another-tag"],
		},
	);
	expect(createMainRes.success).toBeTrue();

	// Create another key for testing with a unique name
	const anotherKey = `${TEST_CONFIG.KEY_NAME}_add_tags_${Date.now()}`;
	const createRes = await yundict.keys.create(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
		{
			name: anotherKey,
			translations: [
				{
					language: "en",
					content: "Test content",
				},
			],
			tags: ["initial-tag", "new-tag", "another-tag"],
		},
	);
	expect(createRes.success).toBeTrue();

	// Batch add tags to both keys
	const addTagsRes = await yundict.keys.addTags(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
		{
			keys: [mainKey, anotherKey],
			tags: ["batch-tag1", "batch-tag2"],
		},
	);
	expect(addTagsRes.success).toBeTrue();

	// Verify tags were added by fetching the keys
	const key1 = await yundict.keys.get(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
		mainKey,
	);
	const key2 = await yundict.keys.get(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
		anotherKey,
	);

	expect(key1.success).toBeTrue();
	expect(key2.success).toBeTrue();
	expect(key1.data).toBeDefined();
	expect(key2.data).toBeDefined();

	expect(key1?.data?.tags).toContain("initial-tag");
	expect(key1?.data?.tags).toContain("new-tag");
	expect(key1?.data?.tags).toContain("another-tag");
	expect(key2?.data?.tags).toContain("initial-tag");
	expect(key2?.data?.tags).toContain("new-tag");
	expect(key2?.data?.tags).toContain("another-tag");
	expect(key2?.data?.tags).toContain("batch-tag1");
	expect(key2?.data?.tags).toContain("batch-tag2");

	// Clean up: delete both test keys
	const deleteRes1 = await yundict.keys.delete(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
		mainKey,
	);
	expect(deleteRes1.success).toBeTrue();

	const deleteRes2 = await yundict.keys.delete(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
		anotherKey,
	);
	expect(deleteRes2.success).toBeTrue();
});

test("Delete tags from multiple keys", async () => {
	// Create main key for testing with a unique name
	const mainKey = `${TEST_CONFIG.KEY_NAME}_delete_${Date.now()}`;
	const createRes = await yundict.keys.create(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
		{
			name: mainKey,
			translations: [
				{
					language: "en",
					content: "Test content for delete",
				},
			],
			tags: ["delete-me", "keep-me", "another-delete-me"],
		},
	);
	expect(createRes.success).toBeTrue();

	// Create another key for testing with a unique name
	const anotherKey = `${TEST_CONFIG.KEY_NAME}_delete_${Date.now()}`;
	const createRes2 = await yundict.keys.create(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
		{
			name: anotherKey,
			translations: [
				{
					language: "en",
					content: "Test content for delete",
				},
			],
			tags: ["delete-me", "keep-me", "another-delete-me"],
		},
	);
	expect(createRes2.success).toBeTrue();

	// Delete specific tags from multiple keys
	const deleteTagsRes = await yundict.keys.deleteTags(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
		{
			keys: [mainKey, anotherKey],
			tags: ["delete-me", "another-delete-me"],
		},
	);

	// Verify API call was successful
	expect(deleteTagsRes.success).toBeTrue();

	// Verify tags were deleted by fetching the keys
	const key1 = await yundict.keys.get(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
		mainKey,
	);
	const key2 = await yundict.keys.get(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
		anotherKey,
	);

	expect(key1.success).toBeTrue();
	expect(key2.success).toBeTrue();
	expect(key1.data).toBeDefined();
	expect(key2.data).toBeDefined();

	// Verify specific tags were deleted while others remain
	expect(key1?.data?.tags).not.toContain("delete-me");
	expect(key1?.data?.tags).not.toContain("another-delete-me");
	expect(key1?.data?.tags).toContain("keep-me");
	expect(key2?.data?.tags).not.toContain("delete-me");
	expect(key2?.data?.tags).not.toContain("another-delete-me");
	expect(key2?.data?.tags).toContain("keep-me");

	// Clean up: delete the additional key
	const deleteMainKey = await yundict.keys.delete(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
		mainKey,
	);
	expect(deleteMainKey.success).toBeTrue();

	const deleteRes = await yundict.keys.delete(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
		anotherKey,
	);
	expect(deleteRes.success).toBeTrue();
});

test("Delete key", async () => {
	const res = await yundict.keys.delete(
		TEST_CONFIG.TEAM_NAME,
		TEST_CONFIG.PROJECT_NAME,
		TEST_CONFIG.KEY_NAME,
	);
	expect(res.success).toBeTrue();
});
