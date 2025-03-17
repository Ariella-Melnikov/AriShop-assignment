import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { Product } from './interfaces/product.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductsService {
  constructor(private databaseService: DatabaseService) {}

  async findAll(): Promise<Product[]> {
    return this.databaseService.findAll<Product, 'products'>('products');
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.databaseService.findById<Product, 'products'>('products', id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const now = new Date();
    const productId = uuidv4(); // Generate product ID in advance
    
    // Add _id to each media item
    const mediaWithIds = createProductDto.media 
      ? createProductDto.media.map(item => ({ _id: uuidv4(), ...item }))
      : [];
    
    // Add _id and productId to each variant
    const variantsWithIds = createProductDto.variants
      ? createProductDto.variants.map(item => ({ 
          _id: uuidv4(), 
          productId: productId, // Add the productId to each variant
          ...item 
        }))
      : [];
    
    const product = {
      _id: productId, // Use the same ID
      ...createProductDto,
      media: mediaWithIds,
      variants: variantsWithIds,
      createdAt: now,
      updatedAt: now,
    };
    
    // Remove _id before passing to create since it adds _id itself
    const { _id, ...productWithoutId } = product;
    
    return this.databaseService.create<Product, 'products'>('products', productWithoutId);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.databaseService.update<Product, 'products'>('products', id, {
      ...updateProductDto,
      updatedAt: new Date(),
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.databaseService.delete('products', id);
    if (!deleted) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
} 