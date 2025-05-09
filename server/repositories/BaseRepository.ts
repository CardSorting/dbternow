import { PrismaClient } from '@prisma/client';
import { IRepository } from '../types/interfaces/IRepository';

/**
 * Base repository implementation
 * Provides common CRUD operations for all entity repositories
 */
export abstract class BaseRepository<T, ID> implements IRepository<T, ID> {
  protected prisma: PrismaClient;
  protected model: string;

  constructor(prisma: PrismaClient, model: string) {
    this.prisma = prisma;
    // Ensure the model name is lowercase to match Prisma's API
    this.model = model.toLowerCase();
  }

  /**
   * Finds all entities
   */
  async findAll(): Promise<T[]> {
    // @ts-ignore - model is dynamically accessed
    return this.prisma[this.model].findMany();
  }

  /**
   * Finds an entity by ID
   */
  async findById(id: ID): Promise<T | null> {
    // @ts-ignore - model is dynamically accessed
    return this.prisma[this.model].findUnique({
      where: { id },
    });
  }

  /**
   * Creates a new entity
   */
  async create(data: Partial<T>): Promise<T> {
    // @ts-ignore - model is dynamically accessed
    return this.prisma[this.model].create({
      data,
    });
  }

  /**
   * Updates an existing entity
   */
  async update(id: ID, data: Partial<T>): Promise<T> {
    // @ts-ignore - model is dynamically accessed
    return this.prisma[this.model].update({
      where: { id },
      data,
    });
  }

  /**
   * Deletes an entity
   */
  async delete(id: ID): Promise<boolean> {
    try {
      // @ts-ignore - model is dynamically accessed
      await this.prisma[this.model].delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error(`Error deleting ${this.model}:`, error);
      return false;
    }
  }
}
