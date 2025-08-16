import { type User, type InsertUser, type ProjectRequest, type InsertProjectRequest } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createProjectRequest(request: InsertProjectRequest): Promise<ProjectRequest>;
  getAllProjectRequests(): Promise<ProjectRequest[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projectRequests: Map<string, ProjectRequest>;

  constructor() {
    this.users = new Map();
    this.projectRequests = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createProjectRequest(insertRequest: InsertProjectRequest): Promise<ProjectRequest> {
    const id = randomUUID();
    const request: ProjectRequest = { 
      ...insertRequest, 
      id,
      createdAt: new Date()
    };
    this.projectRequests.set(id, request);
    return request;
  }

  async getAllProjectRequests(): Promise<ProjectRequest[]> {
    return Array.from(this.projectRequests.values());
  }
}

export const storage = new MemStorage();
