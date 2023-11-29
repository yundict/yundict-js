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
yundict.teams.all()
// Get a team by name
yundict.teams.get('team-name')
// Create a team
yundict.teams.create({ name: "test-team", displayName: "Test Team" });
// Update a team
yundict.teams.update('test-team', { displayName: "Test Team 2" });
// Delete a team
yundict.teams.delete('test-team');
```

## Projects

```typescript
// Get all projects
yundict.projects.all({ team:"my-team" })
// Get a project by name
yundict.projects.get({ team:"my-team", project: 'project-name' })
// Create a project
yundict.projects.create({ team: "my-team"}, { name: "test-project", displayName: "Test Project" });
// Update a project
yundict.projects.update({ team:"my-team", project: 'project-name' }, { name: "new-project", displayName: "Test Project 2" });
// Delete a project
yundict.projects.delete({ team:"my-team", project: 'project-name' })
```

## Keys

```typescript
// Get all keys
yundict.keys.all({ team:"my-team", project: 'project-name' })
// Create a key
yundict.keys.create({ team:"my-team", project: 'project-name', name: "test-key"});
// Update a key
yun.keys.update({ team:"my-team", project: 'project-name', name: "test-key"}, { name: "new-key" });
// Delete a key
yundict.keys.delete({ team:"my-team", project: 'project-name', name: "test-key"});
```