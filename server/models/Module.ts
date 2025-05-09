/**
 * Module domain model
 * Represents a DBT module entity
 */
export interface Module {
  id: string;
  name: string;
  description: string;
  icon?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
