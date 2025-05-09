// Use ES modules as required by the project
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugPrisma() {
  try {
    console.log('Connecting to Prisma...');
    await prisma.$connect();
    
    console.log('Prisma client initialized successfully');
    
    // Debug: Check what models are available directly on the Prisma client
    console.log('\nAvailable Prisma models:');
    const clientKeys = Object.keys(prisma).filter(key => !key.startsWith('$') && typeof prisma[key] === 'object');
    console.log(clientKeys);
    
    // Try to access the 'module' model (lowercase)
    console.log('\nTrying to access module (lowercase):');
    const hasLowercaseModule = prisma['module'] !== undefined;
    console.log(`prisma['module'] exists: ${hasLowercaseModule}`);
    
    // Try to access the 'Module' model (uppercase)
    console.log('\nTrying to access Module (uppercase first letter):');
    const hasUppercaseModule = prisma['Module'] !== undefined;
    console.log(`prisma['Module'] exists: ${hasUppercaseModule}`);
    
    // Check if any lowercase model names exist
    console.log('\nChecking if any lowercase model names exist:');
    const lowercaseNames = clientKeys.filter(key => key.toLowerCase() === key);
    console.log('Lowercase model names:', lowercaseNames);
    
    // Check if any mixed case model names exist
    console.log('\nChecking if any mixed case model names exist:');
    const mixedCaseNames = clientKeys.filter(key => key.toLowerCase() !== key);
    console.log('Mixed case model names:', mixedCaseNames);
    
    console.log('\nDebug complete');
  } catch (error) {
    console.error('Error debugging Prisma:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugPrisma();
