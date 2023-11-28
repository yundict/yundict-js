# yundict-js

A TypeScript library that provides a wrapper for the Yundict API.

# Installation

```bash
npm install yundict
```

# Usage

```typescript
import { Yundict } from 'yundict';

const yundict = new Yundict({
  apiToken: 'API TOKEN'
});
```

# APIs

## Teams

```typescript
// Get all teams
yundict.teams()
// Get a team by name
yundict.team({ name: 'team-name' })
// Create a team
yundict.createTeam({ name: "test-team", displayName: "Test Team" });
// Update a team
yundict.updateTeam('test-team', { displayName: "Test Team 2" });
// Delete a team
yundict.deleteTeam('test-team');
```

## Projects

```typescript
// Get all projects
yundict.projects()
// Get a project by name
yundict.project({ name: 'project-name' })
// Create a project
yundict.createProject({ name: "test-project", displayName: "Test Project" });
// Update a project
yundict.updateProject('test-project', { displayName: "Test Project 2" });
// Delete a project
yundict.deleteProject('test-project');
```