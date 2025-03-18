import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../../features/products/interfaces/product.interface';

interface DatabaseSchema {
  products: Product[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'db.json');

@Injectable()
export class DatabaseService {
  private data: DatabaseSchema = { products: [] };

  constructor() {
    this.initializeDb();
  }

  async initializeDb(): Promise<void> {
    this.data = await fs.readJson(DB_FILE_PATH).catch(() => ({ products: [] }));
    await fs.writeJson(DB_FILE_PATH, this.data, { spaces: 2 });
  }

  private async saveDb(): Promise<void> {
    await fs.writeJson(DB_FILE_PATH, this.data, { spaces: 2 });
  }

  async findAll<T, K extends keyof DatabaseSchema>(collection: K): Promise<T[]> {
    return (this.data[collection] ?? []) as T[];
  }

  async findById<T extends Product, K extends keyof DatabaseSchema>(collection: K, id: string): Promise<T | null> {
    return (this.data[collection] ?? []).find((item: Product) => item._id === id) as T || null;
  }

  async create<T, K extends keyof DatabaseSchema>(collection: K, data: Omit<T, '_id'>): Promise<T> {
    const newItem = { _id: uuidv4(), ...data } as T;
    this.data[collection] = [...this.data[collection], newItem] as any;
    await this.saveDb();
    return newItem;
  }

  async update<T extends Product, K extends keyof DatabaseSchema>(collection: K, id: string, updateData: Partial<T>): Promise<T | null> {
    const collectionData = this.data[collection] as any[];
    const index = collectionData.findIndex((item) => item._id === id);
    if (index === -1) return null;

    collectionData[index] = { ...collectionData[index], ...updateData };
    await this.saveDb();
    return collectionData[index];
  }

  async delete(collection: keyof DatabaseSchema, id: string): Promise<boolean> {
    const collectionData = this.data[collection] as any[];
    const initialLength = collectionData.length;
    this.data[collection] = collectionData.filter((item) => item._id !== id);
    await this.saveDb();
    return initialLength > this.data[collection].length;
  }
}
