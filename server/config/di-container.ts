import { PrismaClient } from '@prisma/client';

// Repositories
import { ModuleRepository } from '../repositories/ModuleRepository';
import { SkillRepository } from '../repositories/SkillRepository';
import { ChallengeRepository } from '../repositories/ChallengeRepository';

// Services
import { ModuleService } from '../services/ModuleService';
import { SkillService } from '../services/SkillService';
import { ChallengeService } from '../services/ChallengeService';

// Controllers
import { ModuleController } from '../controllers/ModuleController';
import { SkillController } from '../controllers/SkillController';
import { ChallengeController } from '../controllers/ChallengeController';

/**
 * Dependency Injection Container
 * Sets up all dependencies and their relationships
 */
export class DIContainer {
  private static instance: DIContainer;
  private prisma: PrismaClient;

  // Repositories
  private moduleRepository!: ModuleRepository;
  private skillRepository!: SkillRepository;
  private challengeRepository!: ChallengeRepository;

  // Services
  private moduleService!: ModuleService;
  private skillService!: SkillService;
  private challengeService!: ChallengeService;

  // Controllers
  private moduleController!: ModuleController;
  private skillController!: SkillController;
  private challengeController!: ChallengeController;

  /**
   * Private constructor to ensure singleton pattern
   */
  private constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.initializeRepositories();
    this.initializeServices();
    this.initializeControllers();
  }

  /**
   * Get the singleton instance of the container
   */
  public static getInstance(prisma: PrismaClient): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer(prisma);
    }
    return DIContainer.instance;
  }

  /**
   * Initialize all repositories
   */
  private initializeRepositories(): void {
    this.moduleRepository = new ModuleRepository(this.prisma);
    this.skillRepository = new SkillRepository(this.prisma);
    this.challengeRepository = new ChallengeRepository(this.prisma);
  }

  /**
   * Initialize all services with their dependencies
   */
  private initializeServices(): void {
    this.moduleService = new ModuleService(this.moduleRepository);
    this.skillService = new SkillService(this.skillRepository);
    this.challengeService = new ChallengeService(this.challengeRepository);
  }

  /**
   * Initialize all controllers with their dependencies
   */
  private initializeControllers(): void {
    this.moduleController = new ModuleController(this.moduleService);
    this.skillController = new SkillController(this.skillService);
    this.challengeController = new ChallengeController(this.challengeService);
  }

  // Getters for controllers
  getModuleController(): ModuleController {
    return this.moduleController;
  }

  getSkillController(): SkillController {
    return this.skillController;
  }

  getChallengeController(): ChallengeController {
    return this.challengeController;
  }
}
