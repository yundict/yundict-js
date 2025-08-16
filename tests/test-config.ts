import type { Yundict } from "../src/main";

/**
 * Test configuration to avoid creating duplicate test resources
 * and reduce API calls during testing
 */
export const TEST_CONFIG = {
  // Use existing test team to avoid creating duplicate resources
  TEAM_NAME: "test-team", // Use existing test team
  PROJECT_NAME: "test-project", // Use existing test project
  KEY_NAME: "sdk-test-key",

  // Display names
  TEAM_DISPLAY_NAME: "Test Team",
  PROJECT_DISPLAY_NAME: "Test awesome project",

  // Project configuration
  PROJECT_BASE_LANGUAGE: "en",
  PROJECT_LANGUAGES: ["zh", "jp"],
} as const;

/**
 * Cleanup utility for removing test resources
 */
export async function cleanupTestResources(yundict: Yundict, teamName: string) {
  try {
    // Delete team (this will cascade delete projects and keys)
    const deleteRes = await yundict.teams.delete(teamName);
    return deleteRes.success;
  } catch (error) {
    console.warn(`Failed to cleanup test resources for team ${teamName}:`, error);
    return false;
  }
}

/**
 * Setup utility for creating test resources
 */
export async function setupTestResources(yundict: Yundict, config = TEST_CONFIG) {
  try {
    // Use existing team and project instead of creating new ones
    const teamsRes = await yundict.teams.all();
    if (!teamsRes.success) {
      throw new Error("Failed to fetch teams");
    }

    const existingTeam = teamsRes.data?.find(team => team.name === config.TEAM_NAME);
    if (!existingTeam) {
      throw new Error(`Test team "${config.TEAM_NAME}" not found. Please ensure the test team exists.`);
    }

    // Check if test project exists
    const projectsRes = await yundict.projects.all(config.TEAM_NAME);
    if (!projectsRes.success) {
      throw new Error("Failed to fetch projects");
    }

    const existingProject = projectsRes.data?.find(proj => proj.name === config.PROJECT_NAME);
    if (!existingProject) {
      throw new Error(`Test project "${config.PROJECT_NAME}" not found in team "${config.TEAM_NAME}". Please ensure the test project exists.`);
    }

    return {
      team: existingTeam,
      project: existingProject,
    };
  } catch (error) {
    console.error("Failed to setup test resources:", error);
    throw error;
  }
}
