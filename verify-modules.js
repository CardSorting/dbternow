import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyModulesAccess() {
  console.log('Verifying module access after fix...');
  
  try {
    // Test direct Prisma access
    console.log('\nTesting direct Prisma module access:');
    const modulesCount = await prisma.module.count();
    console.log(`Found ${modulesCount} modules in the database`);
    
    // Get all modules with their skills
    console.log('\nFetching all modules with their skills:');
    const modules = await prisma.module.findMany({
      include: {
        skills: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
    
    // Print module info
    modules.forEach((module, index) => {
      console.log(`\nModule ${index + 1}: ${module.name}`);
      console.log(`Description: ${module.description}`);
      console.log(`Number of skills: ${module.skills.length}`);
      module.skills.forEach((skill, i) => {
        console.log(`  Skill ${i + 1}: ${skill.name}`);
      });
    });
    
    console.log('\nVerification complete. Module data is accessible!');
    
  } catch (error) {
    console.error('Error verifying module access:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyModulesAccess();
