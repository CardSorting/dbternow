import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log('Created admin user:', admin.email);

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      name: 'Demo User',
      role: 'USER',
    },
  });
  console.log('Created regular user:', user.email);

  // Create DBT modules
  const mindfulnessModule = await prisma.module.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      name: 'Mindfulness',
      description: 'Learn to be present in the moment and observe your thoughts without judgment.',
      icon: '🧠',
      order: 1,
    },
  });

  const distressToleranceModule = await prisma.module.upsert({
    where: { id: '2' },
    update: {},
    create: {
      id: '2',
      name: 'Distress Tolerance',
      description: 'Develop skills to tolerate and survive crisis situations without making them worse.',
      icon: '🛡️',
      order: 2,
    },
  });

  const emotionRegulationModule = await prisma.module.upsert({
    where: { id: '3' },
    update: {},
    create: {
      id: '3',
      name: 'Emotion Regulation',
      description: 'Learn to understand, identify and manage your emotions effectively.',
      icon: '❤️',
      order: 3,
    },
  });

  const interpersonalEffectivenessModule = await prisma.module.upsert({
    where: { id: '4' },
    update: {},
    create: {
      id: '4',
      name: 'Interpersonal Effectiveness',
      description: 'Develop skills to ask for what you need and set boundaries while maintaining relationships.',
      icon: '🤝',
      order: 4,
    },
  });

  console.log('Created 4 DBT modules');

  // Create skills for Mindfulness module
  const mindfulnessSkills = [
    {
      id: '1',
      name: 'Wise Mind',
      description: 'Learning to balance emotion mind and reasonable mind',
      content: "<h2>What is Wise Mind?</h2><p>Wise Mind is the integration of emotion mind and reasonable mind. It's that place where you're able to bring together your emotional experience and your rational thoughts to come up with the most effective approach.</p><h3>Key Aspects:</h3><ul><li>Balanced perspective</li><li>Intuitive knowing</li><li>Seeing the bigger picture</li></ul><p>Practice recognizing when you're in emotion mind, reasonable mind, or wise mind throughout your day.</p>",
      pointsReward: 10,
      order: 1,
      moduleId: mindfulnessModule.id,
    },
    {
      id: '2',
      name: 'Observe',
      description: 'Noticing without getting caught in the experience',
      content: "<h2>The Power of Observation</h2><p>Observing is about noticing what's happening inside and outside of you without immediately reacting to it. It's like watching clouds pass in the sky – you see them but don't have to do anything about them.</p><h3>Practice:</h3><p>Take 5 minutes to simply notice your breath. When thoughts come, acknowledge them and return to watching your breath.</p>",
      pointsReward: 10,
      order: 2,
      moduleId: mindfulnessModule.id,
    },
    {
      id: '3',
      name: 'Describe',
      description: 'Putting words on experience, just the facts',
      content: "<h2>Describing Your Experience</h2><p>Describing means putting words to what you observe without interpretations or judgments. It's about sticking to the facts.</p><h3>Example:</h3><p>Instead of saying \"This is awful,\" try \"I notice I'm having the thought that this is awful.\"</p><p>Practice describing your emotions, sensations, and thoughts as if you were a scientist taking notes.</p>",
      pointsReward: 10,
      order: 3,
      moduleId: mindfulnessModule.id,
    },
  ];

  for (const skill of mindfulnessSkills) {
    await prisma.skill.upsert({
      where: { id: skill.id },
      update: {},
      create: skill,
    });
  }

  console.log('Created skills for Mindfulness module');

  // Create challenges for Wise Mind skill
  const wiseMindChallenges = [
    {
      id: '1',
      title: 'Wise Mind Quiz',
      description: 'Test your understanding of the Wise Mind concept',
      type: 'QUIZ',
      content: JSON.stringify({
        questions: [
          {
            question: 'What is Wise Mind?',
            options: [
              'Pure emotional reasoning',
              'Pure logical thinking',
              'The integration of emotion mind and reasonable mind',
              'Ignoring all emotions',
            ],
            correctAnswer: 2,
          },
          {
            question: 'Which of the following is NOT a characteristic of Wise Mind?',
            options: [
              'Intuitive knowing',
              'Balanced perspective',
              'Rejecting all emotions',
              'Considering both facts and feelings',
            ],
            correctAnswer: 2,
          },
          {
            question: 'How can you practice accessing Wise Mind?',
            options: [
              'By always making decisions based purely on emotion',
              'By taking a moment to breathe and center yourself',
              'By only considering the logical aspects of a situation',
              'By avoiding difficult decisions altogether',
            ],
            correctAnswer: 1,
          },
        ],
      }),
      pointsReward: 20,
      skillId: '1',
    },
    {
      id: '2',
      title: 'Wise Mind Reflection',
      description: 'Reflect on a time you used Wise Mind',
      type: 'REFLECTION',
      content: JSON.stringify({
        prompts: [
          'Think about a recent situation where you had a strong emotional reaction. How did you respond?',
          'Were you able to access your Wise Mind in that situation? If yes, how did it help? If no, what might have changed if you had?',
          'What are some signs that tell you when you\'re in Emotion Mind versus Reasonable Mind?',
          'What strategies help you access your Wise Mind when you\'re feeling emotionally triggered?',
        ],
      }),
      pointsReward: 15,
      skillId: '1',
    },
  ];

  for (const challenge of wiseMindChallenges) {
    await prisma.challenge.upsert({
      where: { id: challenge.id },
      update: {},
      create: challenge,
    });
  }

  console.log('Created challenges for Wise Mind skill');

  // Create challenges for Observe skill
  const observeChallenges = [
    {
      id: '3',
      title: 'Mindful Breathing Practice',
      description: 'A guided exercise for mindful breathing',
      type: 'MEDITATION',
      content: JSON.stringify({
        duration: 5, // 5 minutes
        instructions: 'Find a comfortable position. Focus on your breath, noticing the sensation of air flowing in and out of your body. When your mind wanders (which is normal!), gently bring your attention back to your breath. There\'s no need to control your breathing - just observe it naturally.',
      }),
      pointsReward: 20,
      skillId: '2',
    },
    {
      id: '4',
      title: 'Mindful Observation Practice',
      description: 'Practice observing your environment without judgment',
      type: 'PRACTICE',
      content: JSON.stringify({
        steps: [
          'Choose an object from your immediate environment.',
          'Focus on watching it for two minutes. Simply observe the object without judgment.',
          'Notice the object\'s color, texture, shape, and other physical characteristics.',
          'If you find yourself having thoughts about the object like \"this is boring\" or \"this is beautiful,\" notice these thoughts, then return to simply observing.',
          'After two minutes, reflect on what you noticed during this practice.',
        ],
        tips: [
          'Try using a timer so you\'re not distracted by checking the time.',
          'If your mind wanders, gently bring your attention back to the object.',
          'This exercise can be done with any object - a leaf, a pencil, even food before eating.',
          'The goal is to practice pure observation without getting caught in judgments or stories.',
        ]
      }),
      pointsReward: 15,
      skillId: '2',
    },
  ];

  for (const challenge of observeChallenges) {
    await prisma.challenge.upsert({
      where: { id: challenge.id },
      update: {},
      create: challenge,
    });
  }

  console.log('Created challenges for Observe skill');

  // Create challenges for Describe skill
  const describeChallenges = [
    {
      id: '5',
      title: 'Description vs. Judgment Quiz',
      description: 'Test your ability to distinguish between descriptions and judgments',
      type: 'QUIZ',
      content: JSON.stringify({
        questions: [
          {
            question: 'Which of the following is a description rather than a judgment?',
            options: [
              'This weather is terrible',
              'She\'s being so difficult',
              'The temperature is 45 degrees with rain',
              'He\'s the worst boss ever',
            ],
            correctAnswer: 2,
          },
          {
            question: 'Which is an example of describing an emotion factually?',
            options: [
              'I can\'t handle feeling this way',
              'This feeling is unbearable',
              'I notice I\'m feeling tightness in my chest and my heart is racing',
              'I\'m completely overwhelmed and it\'s ruining everything',
            ],
            correctAnswer: 2,
          },
          {
            question: 'When describing thoughts, which approach is most effective?',
            options: [
              'Assuming your thoughts are facts',
              'Labeling thoughts as \"just thoughts\" or \"I\'m having the thought that...\"',
              'Believing everything your mind tells you',
              'Trying to eliminate all negative thoughts',
            ],
            correctAnswer: 1,
          },
        ],
      }),
      pointsReward: 20,
      skillId: '3',
    },
    {
      id: '6',
      title: 'Describe a Difficult Situation',
      description: 'Practice describing a challenging situation without judgment',
      type: 'SCENARIO',
      content: JSON.stringify({
        scenario: 'You\'ve been waiting in line at a store for 15 minutes. Just as you\'re about to be helped, someone cuts in front of you and the clerk begins helping them instead. You feel your face getting hot and your hands clenching.',
        questions: [
          {
            question: 'Describe the situation using only facts. What happened?',
          },
          {
            question: 'Describe the physical sensations you\'re experiencing without judgment.',
          },
          {
            question: 'Describe the thoughts that might be going through your mind. (Remember to label them as thoughts, not facts)',
          },
          {
            question: 'Which of the following best demonstrates describing emotions without judgment?',
            options: [
              'I feel disrespected and it\'s making me furious.',
              'I notice I\'m feeling anger and frustration.',
              'This is so unfair and I can\'t stand it.',
              'The clerk is rude and doesn\'t care about other customers.',
            ],
          },
        ],
      }),
      pointsReward: 25,
      skillId: '3',
    },
  ];

  for (const challenge of describeChallenges) {
    await prisma.challenge.upsert({
      where: { id: challenge.id },
      update: {},
      create: challenge,
    });
  }

  console.log('Created challenges for Describe skill');

  // Create achievements
  const achievements = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first skill',
      icon: '🌱',
      condition: 'Complete any skill',
      pointsReward: 50,
    },
    {
      id: '2',
      name: 'Mindfulness Master',
      description: 'Complete all skills in the Mindfulness module',
      icon: '🧠',
      condition: 'Complete all skills in the Mindfulness module',
      pointsReward: 100,
    },
    {
      id: '3',
      name: 'Challenge Accepted',
      description: 'Complete 5 challenges',
      icon: '🏆',
      condition: 'Complete any 5 challenges across all skills',
      pointsReward: 75,
    },
    {
      id: '4',
      name: 'Perfect Score',
      description: 'Get 100% on a quiz challenge',
      icon: '🎯',
      condition: 'Score 100% on any quiz challenge',
      pointsReward: 50,
    },
    {
      id: '5',
      name: 'Consistent Practice',
      description: 'Login and complete at least one challenge for 5 consecutive days',
      icon: '📅',
      condition: 'Log in and complete at least one challenge each day for 5 days in a row',
      pointsReward: 150,
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { id: achievement.id },
      update: {},
      create: achievement,
    });
  }

  console.log('Created achievements');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
