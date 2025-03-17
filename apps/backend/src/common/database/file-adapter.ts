import { readFile, writeFile } from 'fs/promises';
import * as path from 'path';

export class FileAdapter<T> {
  private filePath: string;

  constructor(filename: string) {
    this.filePath = path.join(process.cwd(), 'data', filename);
  }

  async read(): Promise<T> {
    try {
      const data = await readFile(this.filePath, 'utf8');
      return JSON.parse(data) as T;
    } catch (error) {
      // Return empty object if file doesn't exist
      return {} as T;
    }
  }

  async write(data: T): Promise<void> {
    await writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }
} 