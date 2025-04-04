import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import type { AppDispatch } from '../store/store'
import { openCartModal } from '../store/slices/cartUiSlice'
import { addCartItem } from '../store/actions/cartActions'
import { RootState } from '../store/store'
import { PageTitle } from '../components/Title/PageTitle'
import { ActionButton } from '../components/Buttons/ActionButton'
import { PageLoader } from '../components/Loader/PageLoader'
import { productService } from '../services/productService'
import { Product } from '@arishop/shared'

export const ProductPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { productId } = useParams()
    const [product, setProduct] = useState<Product | null>(null)
    const { loading} = useSelector((state: RootState) => state.products)
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

    const selectedVariant = product?.variants.find((v) => v.size === selectedSize)

    const handleAddToCart = useCallback(async () => {
        if (!selectedVariant || !product) return
      
        try {
            await dispatch(addCartItem({
                productId: product._id,
                variantId: selectedVariant._id,
                quantity: 1,
              })).unwrap()
            dispatch(openCartModal())
        } catch (error) {
            console.error('Failed to add item to cart:', error)
        }
    }, [dispatch, product, selectedVariant, quantity])

    const price = selectedVariant?.price?.amount || 0
    const currency = selectedVariant?.price?.currency || 'ILS'

    if (!product || loading ) return <PageLoader />

    return (
        <div className='product-page'>
            <div className='product-info'>
                <PageTitle>{product.name}</PageTitle>
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
                    onClick={handleAddToCart}
                />
            </div>
            {/* seconed Column — placeholder for style*/}
            <div className='product-extra'></div>

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
