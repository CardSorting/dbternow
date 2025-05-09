import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Enhanced Content Seed File
 * 
 * This file follows the Separation of Concerns (SoC) principle by separating
 * enhanced content seeding from the basic structure seeding.
 * 
 * Each function is responsible for seeding enhanced content for specific skills.
 */

/**
 * Seed enhanced content for the Observe skill
 * @param {string} skillId - The ID of the Observe skill to enhance
 */
export async function seedEnhancedObserveContent(skillId) {
  try {
    console.log('Seeding enhanced Observe skill content...');
    
    // Enhanced content for the Observe skill
    const enhancedContent = 
      '# Observe Skill: Mindful Awareness Through the Senses\n\n' +
      '## Core Concept\n' +
      'Observing is the foundational mindfulness skill in DBT that involves noticing your experiences through your five senses without trying to change them, label them, or react to them. It\'s about being fully present and aware of both your internal and external experiences without judgment.\n\n' +
      
      '## Key Aspects of Observing\n' +
      '- **Non-judgmental awareness**: Noticing without labeling experiences as "good" or "bad"\n' +
      '- **Present-focused attention**: Staying in the current moment rather than dwelling on past or future\n' +
      '- **Sensory awareness**: Using your five senses to fully experience your environment\n' +
      '- **Internal awareness**: Noticing body sensations, emotions, and thoughts as they arise\n' +
      '- **Letting go of attachment**: Allowing experiences to come and go without grasping or pushing away\n\n' +
      
      '## The Science Behind Observing\n' +
      'Research shows that practicing observation activates the prefrontal cortex while calming the amygdala, reducing emotional reactivity. Regular practice strengthens neural pathways associated with attention control and emotional regulation.\n\n' +
      'Studies have found that mindful observation can:\n' +
      '- Reduce stress hormone levels\n' +
      '- Improve immune function\n' +
      '- Decrease emotional reactivity\n' +
      '- Enhance cognitive flexibility\n\n' +
      
      '## When to Use Observe Skills\n' +
      'The Observe skill is particularly helpful in these situations:\n' +
      '- **During emotional triggers**: Observe physical sensations before reacting\n' +
      '- **When experiencing urges**: Notice the urge without automatically acting on it\n' +
      '- **In interpersonal conflicts**: Observe your reactions before responding\n' +
      '- **During uncomfortable physical sensations**: Observe pain without automatically tensing against it\n' +
      '- **When experiencing racing thoughts**: Observe thoughts without believing all of them\n\n' +
      
      '## How Observe Connects to Other DBT Skills\n' +
      '- **Observe → Describe**: First we notice our experiences (observe), then we can put words to them (describe)\n' +
      '- **Observe → Participate**: By observing without judgment, we can more fully participate in experiences\n' +
      '- **Observe → Emotion Regulation**: Noticing emotions early helps prevent emotional escalation\n' +
      '- **Observe → Distress Tolerance**: Creating space between stimulus and response gives us choices in difficult moments\n\n' +
      
      '## Real-Life Application\n' +
      '### Example: From Reaction to Observation\n' +
      '**Situation**: Someone cuts in front of you in line\n\n' +
      '**Reactive Response**:\n' +
      '- Feel immediate anger\n' +
      '- Tense muscles\n' +
      '- Raised voice\n' +
      '- Confrontation\n\n' +
      
      '**Observational Response**:\n' +
      '1. Notice the physical sensation of heat rising\n' +
      '2. Observe your breath becoming faster\n' +
      '3. Notice thoughts like "That\'s unfair!"\n' +
      '4. Observe the urge to say something harsh\n' +
      '5. Continue breathing and observing until you can choose a wise response\n\n' +
      
      '> "Between stimulus and response, there is a space. In that space is our power to choose our response." — Viktor Frankl';

    // Find the skill by ID and update its content
    const updatedSkill = await prisma.skill.update({
      where: { id: skillId },
      data: {
        content: enhancedContent
      },
    });

    console.log(`Enhanced content updated for Observe skill with ID: ${updatedSkill.id}`);

    // Create additional challenges for the Observe skill
    const newChallenges = [
      {
        title: 'Five Senses Exercise',
        description: 'Practice observing using all five senses in a structured way.',
        type: 'PRACTICE',
        content: 
          'Take 5 minutes to systematically observe using each sense:\n\n' +
          '1. **See**: Notice 5 things you can see without labeling them good/bad\n' +
          '2. **Hear**: Notice 4 sounds in your environment\n' +
          '3. **Touch**: Notice 3 physical sensations (texture, temperature, pressure)\n' +
          '4. **Smell**: Notice 2 scents around you\n' +
          '5. **Taste**: Notice 1 taste (even if it\'s just the inside of your mouth)\n\n' +
          'As you practice, simply observe each sensation without judgment or analysis.',
        pointsReward: 25,
        skillId: skillId
      },
      {
        title: 'Body Scan Meditation',
        description: 'Practice observing physical sensations throughout your body.',
        type: 'MEDITATION',
        content: 
          'Find a comfortable position and take 10 minutes to:\n\n' +
          '1. Begin with several deep breaths\n' +
          '2. Slowly bring attention to each part of your body, starting at your toes\n' +
          '3. Notice any sensations without trying to change them (tension, tingling, temperature, etc.)\n' +
          '4. If your mind wanders, gently return focus to the body part you\'re observing\n' +
          '5. Continue until you\'ve scanned your entire body\n\n' +
          'This practice builds your ability to observe physical sensations neutrally.',
        pointsReward: 30,
        skillId: skillId
      },
      {
        title: 'Watching Thoughts Like Clouds',
        description: 'Practice observing thoughts without becoming attached to them.',
        type: 'MEDITATION',
        content: 
          'For 5 minutes:\n\n' +
          '1. Close your eyes or maintain a soft gaze\n' +
          '2. Imagine your mind as the sky and thoughts as passing clouds\n' +
          '3. Notice each thought as it arises without following it or pushing it away\n' +
          '4. Watch thoughts drift across your mind without attaching to them\n' +
          '5. If you get caught in a thought, gently return to watching\n\n' +
          'This exercise helps you observe thoughts without becoming identified with them.',
        pointsReward: 25,
        skillId: skillId
      }
    ];

    // Create each challenge
    for (const challengeData of newChallenges) {
      const challenge = await prisma.challenge.create({
        data: challengeData
      });
      console.log(`Created new challenge: ${challenge.title}`);
    }

    console.log('Enhanced Observe skill content seed completed successfully');
    return true;
  } catch (error) {
    console.error('Error seeding enhanced Observe skill content:', error);
    throw error;
  }
}

/**
 * Main function to seed all enhanced content
 * This allows for easy expansion to other skills in the future
 */
export async function seedEnhancedContent() {
  try {
    console.log('Starting enhanced content seed...');
    
    // Find the Observe skill by name in the Mindfulness module
    const mindfulnessModule = await prisma.module.findFirst({
      where: { name: 'Mindfulness' }
    });
    
    if (!mindfulnessModule) {
      throw new Error('Mindfulness module not found. Run the basic seed first.');
    }
    
    const observeSkill = await prisma.skill.findFirst({
      where: { 
        name: 'Observe',
        moduleId: mindfulnessModule.id
      }
    });
    
    if (!observeSkill) {
      throw new Error('Observe skill not found. Run the basic seed first.');
    }
    
    // Seed enhanced content for Observe skill
    await seedEnhancedObserveContent(observeSkill.id);
    
    // Add more enhanced content seed functions here as needed
    // await seedEnhancedDescribeContent(describeSkill.id);
    // etc.
    
    console.log('All enhanced content seeded successfully!');
  } catch (error) {
    console.error('Error seeding enhanced content:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Allow running this seed directly
if (process.argv[1] === import.meta.url) {
  seedEnhancedContent()
    .catch(e => {
      console.error(e);
      process.exit(1);
    });
}
