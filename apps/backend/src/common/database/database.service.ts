import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../../features/products/interfaces/product.interface';

interface DatabaseSchema {
  products: Product[];
}

@Injectable()
export class DatabaseService {
  private db: any;

  constructor() {
    this.initializeDb();
  }

  private async initializeDb() {
    const { Low } = await import('lowdb');
    const { JSONFile } = await import('lowdb/node');
    
    const file = path.join(process.cwd(), 'data', 'db.json');
    const adapter = new JSONFile<DatabaseSchema>(file);
    this.db = new Low(adapter, { products: [] });
  }

  async initialize() {
    await this.db.read();
    this.db.data ||= { products: [] };
    await this.db.write();
  }

  async findAll<T, K extends keyof DatabaseSchema>(
    collection: K
  ): Promise<T[]> {
    await this.db.read();
    return this.db.data[collection] as T[];
  }

  async findById<T, K extends keyof DatabaseSchema>(
    collection: K, 
    id: string
  ): Promise<T | null> {
    await this.db.read();
    return this.db.data[collection].find((item: { _id: string }) => item._id === id) as T;
  }

  async create<T, K extends keyof DatabaseSchema>(
    collection: K, 
    data: Omit<T, '_id'>
  ): Promise<T> {
    await this.db.read();
    const newItem = { _id: uuidv4(), ...data } as T;
    (this.db.data[collection] as unknown as T[]).push(newItem);
    await this.db.write();
    return newItem;
  }

  async update<T, K extends keyof DatabaseSchema>(
    collection: K, 
    id: string, 
    data: Partial<T>
  ): Promise<T | null> {
    await this.db.read();
    const index = this.db.data[collection].findIndex((item: { _id: string }) => item._id === id);
    if (index === -1) return null;

    this.db.data[collection][index] = {
      ...this.db.data[collection][index],
      ...data,
    };
    await this.db.write();
    return this.db.data[collection][index] as T;
  }

  async delete(collection: keyof DatabaseSchema, id: string): Promise<boolean> {
    await this.db.read();
    const initialLength = this.db.data[collection].length;
    this.db.data[collection] = this.db.data[collection].filter(
      (item: { _id: string }) => item._id !== id
    );
    await this.db.write();
    return initialLength > this.db.data[collection].length;
  }
} 