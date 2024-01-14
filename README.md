# Yundict API JavaScript client

[![npm](https://img.shields.io/npm/v/yundict)](https://www.npmjs.com/package/yundict)
[![Run test](https://github.com/yundict/yundict-js/actions/workflows/test.yml/badge.svg)](https://github.com/yundict/yundict-js/actions/workflows/test.yml)
[![Downloads total](https://img.shields.io/npm/dt/yundict)](https://www.npmjs.com/package/yundict)

The official JavaScript / TypeScript / Node.js library for the [Yundict API](https://yundict.com/docs/api/).

# Features

- [x] Includes core API methods (teams, projects, keys)
- [x] ESM only
- [x] TypeScript support
- [x] Node.js / Bun.js / Deno / Browser support

# Installation

```bash
npm install yundict
```

# Usage

```typescript
import { Yundict } from 'yundict';

const yundict = new Yundict({
  token: 'API TOKEN'
});
```

## Options

| name | Type | Description |
| --- | --- | --- |
| token | string | API token |
| request.fetch | function | Custom replacement for built-in fetch method |

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
yundict.projects.all({ teamName:"my-team" })
// Get a project by name
yundict.projects.get("my-team", 'my-proj')
// Create a project
yundict.projects.create("my-team", { displayName: "Test Project" });
// Update a project
yundict.projects.update("my-team", 'my-proj', { displayName: "Test Project 2" });
// Delete a project
yundict.projects.delete("my-team", 'my-proj')
```

## Keys

```typescript
// Get all keys
yundict.keys.all("my-team", 'my-proj')
// Create a key
yundict.keys.create("my-team", 'my-proj', "test-key");
// Update a key
yun.keys.update("my-team", 'my-proj', "test-key", { name: "new-key" });
// Delete a key
yundict.keys.delete("my-team", 'my-proj', "test-key");
```
