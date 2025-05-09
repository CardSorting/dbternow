import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function fixModulesIssue() {
  console.log('Starting database cleanup and repair process...');
  
  try {
    // Step 1: Delete all module-related data in the correct order
    console.log('Deleting all module-related data...');
    
    // Delete challenge results
    console.log('Deleting challenge results...');
    await prisma.challengeResult.deleteMany({});
    
    // Delete challenges
    console.log('Deleting challenges...');
    await prisma.challenge.deleteMany({});
    
    // Delete completed skills
    console.log('Deleting completed skills...');
    await prisma.completedSkill.deleteMany({});
    
    // Delete progress tracking
    console.log('Deleting module progress...');
    await prisma.progress.deleteMany({});
    
    // Delete skills
    console.log('Deleting skills...');
    await prisma.skill.deleteMany({});
    
    // Delete modules
    console.log('Deleting modules...');
    await prisma.module.deleteMany({});
    
    console.log('All module-related data has been deleted.');
    
    // Step 2: Trigger the seed process to repopulate the database
    console.log('\nReseeding the database...');
    console.log('Running prisma db seed...');
    
    // Use execSync to run the db seed command
    const seedOutput = execSync('npx prisma db seed').toString();
    console.log(seedOutput);
    
    console.log('\nDatabase has been successfully reseeded!');
    console.log('The module data has been repaired.');
    
  } catch (error) {
    console.error('Error during database fix:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixModulesIssue();
