import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script to clean up corrupted module data and reseed the database
 */
async function cleanupAndReseed() {
  console.log('Starting cleanup of corrupted module data...');
  
  try {
    // Delete in order of dependencies to maintain referential integrity
    // First remove ChallengeResults
    console.log('Cleaning up challenge results...');
    await prisma.challengeResult.deleteMany({});
    
    // Delete all challenges
    console.log('Cleaning up challenges...');
    await prisma.challenge.deleteMany({});
    
    // Delete completed skills
    console.log('Cleaning up completed skills...');
    await prisma.completedSkill.deleteMany({});
    
    // Delete all skills
    console.log('Cleaning up skills...');
    await prisma.skill.deleteMany({});
    
    // Delete progress records
    console.log('Cleaning up progress records...');
    await prisma.progress.deleteMany({});
    
    // Delete all modules (root of the corruption)
    console.log('Cleaning up corrupted modules...');
    await prisma.module.deleteMany({});
    
    console.log('All module-related data has been cleaned.');
    
    // Reseed the database by running the seed script
    console.log('Reseeding database with modules...');
    console.log('Please run "npx prisma db seed" after this script completes to fully reseed the database');
    
    console.log('Database cleanup completed successfully!');
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
cleanupAndReseed();
