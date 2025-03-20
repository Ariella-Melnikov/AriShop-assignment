import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { Product } from '@shared/types/product';
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
    const productId = uuidv4();
    
    const mediaWithIds = createProductDto.media 
      ? createProductDto.media.map(item => ({ _id: uuidv4(), ...item }))
      : [];
    
    const variantsWithIds = createProductDto.variants
      ? createProductDto.variants.map(item => ({ 
          _id: uuidv4(), 
          productId: productId,
          ...item 
        }))
      : [];
    
    const product: Product = {
      _id: productId,
      name: createProductDto.name,
      description: createProductDto.description,
      categories: createProductDto.categories,
      tags: createProductDto.tags,
      basePrice: createProductDto.basePrice,
      media: mediaWithIds,
      variants: variantsWithIds,
      availability: {
        inStock: variantsWithIds.some(v => v.inventory > 0)
      },
      createdAt: now,
      updatedAt: now,
    };
    
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