import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './product.schema';
import { Model } from 'mongoose';
import { Variant } from '@arishop/shared';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { CreateVariantDto } from './dto/create-variant.dto';

@Injectable()
export class VariantsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) {}

  async addVariants(
    productId: string,
    createVariantsDto: CreateVariantDto[]
  ): Promise<Variant[]> {
    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Add new variants to product
    const newVariants = createVariantsDto.map((variant) => ({
      productId,
      ...variant,
    }));

    product.variants.push(...(newVariants as any));
    product.availability = {
      inStock: product.variants.some((v) => v.inventory?.quantity > 0),
    };
    product.updatedAt = new Date();

    await product.save();

    // Return only the newly added variants (Mongo will have assigned _id)
    const addedVariants = product.variants.slice(-createVariantsDto.length);
    return addedVariants;
  }

  async updateVariant(
    productId: string,
    variantId: string,
    updateVariantDto: UpdateVariantDto
  ): Promise<Variant> {
    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const variantIndex = product.variants.findIndex(
      (v) => v._id === variantId
    );

    if (variantIndex === -1) {
      throw new NotFoundException(
        `Variant with ID ${variantId} not found in product ${productId}`
      );
    }

    product.variants[variantIndex] = {
      ...product.variants[variantIndex],
      ...updateVariantDto,
    };

    product.updatedAt = new Date();
    await product.save();

    return product.variants[variantIndex];
  }
}