import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { productService } from '../services/productService'
import { Product } from '@arishop/shared'
import { Title } from '../components/Title/Title'
import { ActionButton } from '../components/Buttons/ActionButton'
import { addToCart } from '../store/slices/cartSlice'
import { openCartModal } from '../store/slices/cartUiSlice'
import type { AppDispatch } from '../store/store'

export const ProductPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { productId } = useParams()
    const [product, setProduct] = useState<Product | null>(null)
    const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium')
    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        if (productId) {
            productService
                .fetchProductById(productId)
                .then(setProduct)
                .catch((err) => console.error(err))
        }
    }, [productId])

    if (!product) return <div>Loading product...</div>

    const selectedVariant = product.variants.find((v) => v.size === selectedSize)
    const price = selectedVariant?.price?.amount || 0
    const currency = selectedVariant?.price?.currency || 'ILS'

    return (
        <div className='product-page'>
            <div className='product-info'>
                <Title>{product.name}</Title>
                <p className='product-description'>{product.description}</p>

                <div className='variant-select'>
                    <span>Choose Size:</span>
                    {['small', 'medium', 'large'].map((size) => {
                        const hasVariant = product.variants.some((v) => v.size === size)
                        const isSelected = selectedSize === size

                        return (
                            <button
                                key={size}
                                className={`variant-button ${isSelected ? 'active' : ''} ${
                                    !hasVariant ? 'disabled' : ''
                                }`}
                                onClick={() => hasVariant && setSelectedSize(size as 'small' | 'medium' | 'large')}
                                disabled={!hasVariant}>
                                {size.charAt(0).toUpperCase()}
                            </button>
                        )
                    })}
                </div>

                <div className='quantity-select'>
                    <span>Quantity:</span>
                    <div className='quantity-buttons'>
                        <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
                        <span>{quantity}</span>
                        <button onClick={() => setQuantity((q) => q + 1)}>+</button>
                    </div>
                </div>

                <div className='price'>
                    <span>
                        {(price * quantity).toFixed(2)} {currency}
                    </span>
                </div>

                <ActionButton
                    label='Add to Cart'
                    onClick={() => {
                        if (!selectedVariant) return

                        dispatch(
                            addToCart({
                                productId: product._id,
                                variantId: selectedVariant._id,
                                quantity,
                                price: selectedVariant.price.amount,
                            })
                        )
                        dispatch(openCartModal())
                    }}
                />
            </div>
            {/* seconed Column — placeholder for future content */}
            <div className='product-extra'>{/* Could be recommendations, reviews, etc. */}</div>
            {/* third Column */}
            <div className='product-gallery'>
                {product.media?.[0] && (
                    <img
                        src={product.media[0].url}
                        alt={product.media[0].altText || product.name}
                        className='product-image'
                    />
                )}
            </div>
        </div>
    )
}
