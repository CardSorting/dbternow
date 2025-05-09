# Enhanced DBT Content Architecture

This document describes the architecture for enhanced DBT content in the application, following the Separation of Concerns (SoC) principle.

## Overview

The enhanced content system is designed to:

1. Separate basic structure seeding from rich content seeding
2. Allow independent development and updates of skill content
3. Enable targeted enrichment of specific skills without affecting others
4. Support a modular approach to content management

## Architecture

### Separation of Concerns

The seeding process is separated into distinct modules with specific responsibilities:

1. **Basic Structure Seed** (`dbt-seed.js`)
   - Establishes the core DBT modules, skills, and basic challenges
   - Provides minimal content for initial application functionality
   - Sets up the structural foundation for the application

2. **Enhanced Content Seed** (`enhanced-content-seed.js`)
   - Enriches existing skills with detailed content
   - Adds additional challenges for targeted skills
   - Operates on existing database entities created by the basic seed

3. **Main Seed Orchestrator** (`seed.ts`)
   - Coordinates the execution of all seed operations
   - Ensures proper sequencing (base structure before enhanced content)
   - Manages connection to the database

### File Structure

```
prisma/
├── schema.prisma       # Database schema definition
├── seed.ts             # Main seed orchestrator
├── dbt-seed.js         # Basic DBT structure seed
└── enhanced-content-seed.js  # Enhanced content seed
```

## Implementation Details

### Enhanced Content Seed

The `enhanced-content-seed.js` file follows these design principles:

1. **Modular Functions**: Each skill has its own dedicated enhancement function
2. **Independent Execution**: Can be run separately from the main seed for content-only updates
3. **Error Handling**: Contains proper error handling and validation
4. **Schema Compliance**: Ensures content follows the required data structure

### Content Organization

Enhanced content is structured with consideration for:

1. **Readability**: Using Markdown formatting for better rendering
2. **Hierarchy**: Organizing information in clear sections with headers
3. **Visual Elements**: Including typography suggestions for UI rendering
4. **Progressive Disclosure**: Arranging information from basic to advanced

## Adding New Enhanced Content

To add enhanced content for a new skill:

1. Create a new function in `enhanced-content-seed.js` following the pattern:
   ```javascript
   export async function seedEnhanced[SkillName]Content(skillId) {
     // Implementation here
   }
   ```

2. Add the function call in the `seedEnhancedContent` main function:
   ```javascript
   // Find the skill
   const skillToEnhance = await prisma.skill.findFirst({
     where: { name: 'SkillName' }
   });
   
   // Call the enhancement function
   await seedEnhanced[SkillName]Content(skillToEnhance.id);
   ```

3. Follow the content structure guidelines:
   - Start with a clear title and core concept
   - Include key aspects/components
   - Add scientific background if relevant
   - Provide real-life applications
   - Create additional challenges with varied types

## Content Guidelines

When developing enhanced content:

1. **Use Markdown**: Format content using Markdown for structured rendering
2. **Be Concise**: Keep paragraphs short and focused
3. **Use Lists**: Break down complex ideas into bullet points
4. **Include Examples**: Provide concrete examples for abstract concepts
5. **Add Challenges**: Create varied practice exercises (meditations, reflections, quizzes)

## Example: Observe Skill

The Observe skill demonstrates the enhanced content approach with:

- Comprehensive skill explanation
- Scientific background
- Real-life applications
- Connections to other DBT skills
- Multiple practice challenges with different approaches

## Running the Seeds

To run the enhanced content seed:

```bash
# Run the basic seed first
npx prisma db seed

# Then run the enhanced content seed separately
node --loader ts-node/esm prisma/run-enhanced-seed.js
```

Note: We've separated the enhanced content seeding into a standalone script (`run-enhanced-seed.js`) to avoid potential module loading issues. This follows the Separation of Concerns principle by keeping the basic structure seeding separate from the enhanced content seeding.
