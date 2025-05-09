import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed file for DBT modules, skills, and challenges
 * This creates the four core DBT modules with their respective skills and practice challenges
 */
export async function seedDBT() {
  try {
    console.log('Starting DBT seed...');

    // Create Mindfulness Module
    const mindfulnessModule = await prisma.module.create({
      data: {
        name: 'Mindfulness',
        description: 'Mindfulness is the foundation of DBT. It involves being fully aware and present in the moment without judgment.',
        icon: '🧘',
        order: 1,
      },
    });

    console.log('Created Mindfulness module');

    // Mindfulness Skills
    const mindfulnessSkills = [
      {
        name: 'Observe',
        description: 'Pay attention to experiences through your senses without reacting to them.',
        content: 
          '# Observe Skill\n\n' +
          'Observing is noticing without words. It is sensing or experiencing without describing or labeling the experience.',
        pointsReward: 15,
        order: 1,
        moduleId: mindfulnessModule.id,
        challenges: {
          create: [
            {
              title: 'One-Minute Observation',
              description: 'Take one minute to observe your surroundings in detail.',
              type: 'PRACTICE',
              content: 'For this challenge, set a timer for one minute and observe your immediate surroundings.',
              pointsReward: 20,
            }
          ]
        }
      },
      {
        name: 'Describe',
        description: 'Put words to your experience by labeling emotions, thoughts, and sensations.',
        content: '# Describe Skill\n\nDescribing means putting words on what you observe.',
        pointsReward: 15,
        order: 2,
        moduleId: mindfulnessModule.id,
        challenges: {
          create: [
            {
              title: 'Emotion Journal',
              description: 'Identify and describe three emotions you experienced today.',
              type: 'REFLECTION',
              content: 'Think about three different emotions you experienced today.',
              pointsReward: 20,
            }
          ]
        }
      }
    ];

    for (const skillData of mindfulnessSkills) {
      await prisma.skill.create({
        data: skillData,
      });
      console.log(`Created skill: ${skillData.name}`);
    }

    // Create Distress Tolerance Module
    const distressToleranceModule = await prisma.module.create({
      data: {
        name: 'Distress Tolerance',
        description: 'Skills to help you cope with crisis situations and accept reality when it cannot be changed immediately.',
        icon: '🛡️',
        order: 2,
      },
    });

    console.log('Created Distress Tolerance module');

    // Distress Tolerance Skills
    const distressToleranceSkills = [
      {
        name: 'Crisis Survival Skills',
        description: 'Techniques to help you tolerate painful events, urges, and emotions when you cannot make things better right away.',
        content: '# Crisis Survival Skills\n\nThese skills help you get through painful situations without making things worse.',
        pointsReward: 15,
        order: 1,
        moduleId: distressToleranceModule.id,
        challenges: {
          create: [
            {
              title: 'TIPP Skills Practice',
              description: 'Practice one of the TIPP skills to reduce emotional intensity.',
              type: 'PRACTICE',
              content: 'Choose one of the TIPP skills to practice when you notice your emotions are becoming intense.',
              pointsReward: 20,
            }
          ]
        }
      },
      {
        name: 'Radical Acceptance',
        description: 'Completely and totally accepting reality as it is, without fighting against it.',
        content: '# Radical Acceptance\n\nRadical acceptance means completely and totally accepting reality from the depths of your soul.',
        pointsReward: 15,
        order: 2,
        moduleId: distressToleranceModule.id,
        challenges: {
          create: [
            {
              title: 'Acceptance Statements',
              description: 'Practice creating and using acceptance statements for a difficult situation.',
              type: 'REFLECTION',
              content: 'Think of a situation in your life that you\'re having trouble accepting.',
              pointsReward: 20,
            }
          ]
        }
      }
    ];

    for (const skillData of distressToleranceSkills) {
      await prisma.skill.create({
        data: skillData,
      });
      console.log(`Created skill: ${skillData.name}`);
    }

    // Create Emotion Regulation Module
    const emotionRegulationModule = await prisma.module.create({
      data: {
        name: 'Emotion Regulation',
        description: 'Skills to understand, identify, and manage your emotions effectively.',
        icon: '❤️‍🩹',
        order: 3,
      },
    });

    console.log('Created Emotion Regulation module');

    // Emotion Regulation Skills
    const emotionRegulationSkills = [
      {
        name: 'Identifying Emotions',
        description: 'Learn to recognize and name your emotions accurately.',
        content: '# Identifying Emotions\n\nIdentifying emotions involves observing and describing your emotional experiences with accuracy.',
        pointsReward: 15,
        order: 1,
        moduleId: emotionRegulationModule.id,
        challenges: {
          create: [
            {
              title: 'Emotion Journal',
              description: 'Track and analyze your emotions throughout the day.',
              type: 'PRACTICE',
              content: 'For one day, notice and record your emotions at least 3 times (morning, afternoon, evening).',
              pointsReward: 20,
            }
          ]
        }
      },
      {
        name: 'Opposite Action',
        description: 'Change emotions by acting opposite to their action urges.',
        content: '# Opposite Action\n\nOpposite action involves doing the opposite of what your emotion urges you to do.',
        pointsReward: 15,
        order: 2,
        moduleId: emotionRegulationModule.id,
        challenges: {
          create: [
            {
              title: 'Opposite Action Practice',
              description: 'Apply opposite action to a challenging emotion.',
              type: 'PRACTICE',
              content: 'Identify an emotion that\'s causing you difficulty.',
              pointsReward: 20,
            }
          ]
        }
      }
    ];

    for (const skillData of emotionRegulationSkills) {
      await prisma.skill.create({
        data: skillData,
      });
      console.log(`Created skill: ${skillData.name}`);
    }

    // Create Interpersonal Effectiveness Module
    const interpersonalModule = await prisma.module.create({
      data: {
        name: 'Interpersonal Effectiveness',
        description: 'Skills to build better relationships, set boundaries, and communicate effectively.',
        icon: '🤝',
        order: 4,
      },
    });

    console.log('Created Interpersonal Effectiveness module');

    // Interpersonal Effectiveness Skills
    const interpersonalSkills = [
      {
        name: 'DEAR MAN',
        description: 'A skill set for making requests and saying no effectively.',
        content: '# DEAR MAN Skill\n\nDEAR MAN is an acronym for a set of skills that help you ask for what you want or say no to requests effectively.',
        pointsReward: 15,
        order: 1,
        moduleId: interpersonalModule.id,
        challenges: {
          create: [
            {
              title: 'DEAR MAN Script',
              description: 'Create a DEAR MAN script for a real-life situation.',
              type: 'PRACTICE',
              content: 'Think of a situation where you need to make a request or set a boundary.',
              pointsReward: 20,
            }
          ]
        }
      },
      {
        name: 'GIVE',
        description: 'Skills for maintaining relationships while getting what you need.',
        content: '# GIVE Skill\n\nThe GIVE skill focuses on how to maintain relationships during difficult conversations.',
        pointsReward: 15,
        order: 2,
        moduleId: interpersonalModule.id,
        challenges: {
          create: [
            {
              title: 'Validation Practice',
              description: 'Practice validating others\' perspectives and emotions.',
              type: 'PRACTICE',
              content: 'For this challenge, practice validating others in your daily interactions.',
              pointsReward: 20,
            }
          ]
        }
      }
    ];

    for (const skillData of interpersonalSkills) {
      await prisma.skill.create({
        data: skillData,
      });
      console.log(`Created skill: ${skillData.name}`);
    }

    // Create Achievements
    const achievements = [
      {
        name: 'First Steps',
        description: 'Complete any skill in DBT',
        icon: '🌱',
        condition: 'Complete any skill',
        pointsReward: 50,
      },
      {
        name: 'Mindfulness Master',
        description: 'Complete all skills in the Mindfulness module',
        icon: '🧘',
        condition: 'Complete all skills in the Mindfulness module',
        pointsReward: 100,
      },
      {
        name: 'DBT Graduate',
        description: 'Complete all modules and skills in DBT',
        icon: '🎓',
        condition: 'Complete all skills across all modules',
        pointsReward: 200,
      }
    ];

    for (const achievementData of achievements) {
      await prisma.achievement.create({
        data: achievementData,
      });
      console.log(`Created achievement: ${achievementData.name}`);
    }

    console.log('DBT seed completed successfully!');
  } catch (error) {
    console.error('Error seeding DBT data:', error);
    throw error;
  }
}
