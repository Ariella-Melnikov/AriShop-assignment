import { Controller, Put, Param, Body, NotFoundException, Post, Delete, HttpCode } from '@nestjs/common'
import { VariantsService } from './variants.service'
import { UpdateVariantDto } from './dto/update-variant.dto'
import { Variant } from '@arishop/shared'
import { CreateVariantsDto } from './dto/create-variant.dto'

@Controller('products/:productId/variants') 
export class VariantsController {
    constructor(private readonly variantsService: VariantsService) {}

    @Post()
    async addVariants(@Param('productId') productId: string, @Body() createVariantsDto: CreateVariantsDto) {
        return this.variantsService.addVariants(productId, createVariantsDto.variants)
    }

    @Put(':variantId')
    async updateVariant(
        @Param('productId') productId: string,
        @Param('variantId') variantId: string,
        @Body() updateVariantDto: UpdateVariantDto
    ): Promise<Variant> {
        const updatedVariant = await this.variantsService.updateVariant(productId, variantId, updateVariantDto)

        if (!updatedVariant) {
            throw new NotFoundException(`Variant with ID ${variantId} not found for product ${productId}`)
        }

        return updatedVariant
    }

    @Delete(':variantId')
    @HttpCode(204)
    async removeVariant(
        @Param('productId') productId: string,
        @Param('variantId') variantId: string
    ): Promise<void> {
        return this.variantsService.removeVariant(productId, variantId);
    }
}
