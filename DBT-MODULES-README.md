# DBT Modules Architecture

This document provides an overview of the Dialectical Behavior Therapy (DBT) modules implemented in this application.

## Overview

DBT is a type of talk therapy for people who experience emotions very intensely. The application provides structured modules, skills, and interactive challenges to help users learn and practice DBT concepts.

## Architecture

The implementation follows SOLID principles and clean architecture with a clear separation of concerns:

### Domain Layer

- **Models**: Represent core entities (Module, Skill, Challenge, ChallengeResult)
- Located in `server/models/`

### Data Access Layer

- **Repository Interfaces**: Define contracts for data access
- **Repository Implementations**: Implement data access using Prisma ORM
- Located in `server/types/interfaces/` and `server/repositories/`

### Business Logic Layer

- **Service Interfaces**: Define business operations
- **Service Implementations**: Implement business logic and orchestrate repositories
- Located in `server/types/interfaces/` and `server/services/`

### Presentation Layer

- **Controllers**: Handle HTTP requests/responses and use services
- Located in `server/controllers/`
- **Routes**: Define API endpoints and connect to controllers
- Located in `server/routes/`

### Dependency Injection

- **DI Container**: Manages dependencies and their lifecycle
- Located in `server/config/di-container.ts`

## DBT Module Structure

The DBT content is organized hierarchically:

1. **Modules**: Top-level categories (Mindfulness, Distress Tolerance, etc.)
2. **Skills**: Specific techniques within modules
3. **Challenges**: Interactive exercises to practice skills

## Data Seeding

The application includes seed data for DBT modules:
- Basic seed data in `prisma/seed.ts`
- Specialized DBT content in `prisma/dbt-seed.ts`

To seed the database:
```
npx prisma db seed
```

The application is configured with proper seed settings in package.json:
```json
"prisma": {
  "seed": "node --loader ts-node/esm prisma/seed.ts"
}
```

## API Endpoints

### Modules
- `GET /api/modules` - Get all modules
- `GET /api/modules/:id` - Get a module by ID 
- `GET /api/modules/:id/progress` - Get user progress for a module
- `GET /api/modules/progress` - Get progress for all modules
- `POST /api/modules` - Create a new module (admin only)
- `PUT /api/modules/:id` - Update a module (admin only)
- `DELETE /api/modules/:id` - Delete a module (admin only)

### Skills
- `GET /api/skills` - Get all skills
- `GET /api/skills/:id` - Get a skill by ID
- `GET /api/skills/by-module/:moduleId` - Get skills by module ID
- `GET /api/skills/:id/progress` - Get user progress for a skill
- `POST /api/skills` - Create a new skill (admin only)
- `PUT /api/skills/:id` - Update a skill (admin only)
- `DELETE /api/skills/:id` - Delete a skill (admin only)

### Challenges
- `GET /api/challenges` - Get all challenges
- `GET /api/challenges/:id` - Get a challenge by ID
- `GET /api/challenges/by-skill/:skillId` - Get challenges by skill ID
- `GET /api/challenges/:id/result` - Get user results for a challenge
- `POST /api/challenges` - Create a new challenge (admin only)
- `PUT /api/challenges/:id` - Update a challenge (admin only)
- `DELETE /api/challenges/:id` - Delete a challenge (admin only)
- `POST /api/challenges/:id/submit` - Submit challenge results

## Main DBT Modules

1. **Mindfulness**: Being fully aware and present in the moment without judgment
2. **Distress Tolerance**: Skills to cope with crisis situations and accept reality
3. **Emotion Regulation**: Understanding, identifying, and managing emotions
4. **Interpersonal Effectiveness**: Building better relationships and setting boundaries
