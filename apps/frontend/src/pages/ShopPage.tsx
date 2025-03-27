import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store/store'
import { fetchProducts, toggleTag, fetchTags, setSortOrder } from '../store/slices/productSlice'
import { ProductList } from '../components/ProductList/ProductList'
import { addToCart } from '../store/slices/cartSlice'
import { Product, Variant } from '@arishop/shared'
import { Title } from '../components/Title/Title'
import { Tag } from '../components/Buttons/TagButton'
import { SortBox } from '../components/SortBox/SortBox'
import { Banner } from '../components/Banner/Banner'
import shopHeroImg from '../assets/img/Shop-hero.png'
import { CartModal } from '../components/Modal/CartModal'
import { openCartModal } from '../store/slices/cartUiSlice'

export const ShopPage = () => {
    const dispatch = useDispatch<AppDispatch>()

    const { loading, error } = useSelector((state: RootState) => state.products)
    const products = useSelector((state: RootState) => state.products.products)
    const filteredProducts = useSelector((state: RootState) => state.products.filteredProducts)
    const allTags = useSelector((state: RootState) => state.products.allTags)
    const selectedTags = useSelector((state: RootState) => state.products.selectedTags)
    const sortOrder = useSelector((state: RootState) => state.products.sortOrder)

    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts())
            dispatch(fetchTags())
        }
    }, [dispatch, products.length])

    const getBestAvailableVariant = (product: Product) => {
        const preferredOrder: ('medium' | 'small' | 'large')[] = ['medium', 'small', 'large']
        return (
            preferredOrder
                .map((size) => product.variants.find((v) => v.size === size && v.inventory.quantity > 0))
                .find(Boolean) || null
        )
    }

    const productCardsData = filteredProducts.map((product) => {
        const variant = getBestAvailableVariant(product)
        return {
            product,
            displayVariant: variant,
        }
    })

    const handleAddToCart = (product: Product, variant: Variant) => {
        dispatch(
            addToCart({
                productId: product._id,
                variantId: variant._id,
                quantity: 1,
                price: variant.price.amount,
            })
        )
        dispatch(openCartModal())
    }

    if (loading) {
        return <div className='loading'>Loading...</div>
    }

    if (error) {
        return <div className='error'>{error}</div>
    }

    return (
        <div className='shop-page'>
            <Banner imgUrl={shopHeroImg} />
            <div className='shop-title'>
                <Title>All Bouquets</Title>
            </div>

            <div className='tag-filters'>
                <div className='tag-buttons'>
                    {allTags.map((tag) => (
                        <Tag
                            key={tag}
                            label={tag}
                            isActive={selectedTags.includes(tag)}
                            onClick={() => dispatch(toggleTag(tag))}
                        />
                    ))}
                </div>
                <div className='sort-section'>
                    <SortBox active={sortOrder} onChange={(val) => dispatch(setSortOrder(val))} />
                </div>
            </div>

            <div className='products-container'>
                <ProductList products={productCardsData} onAddToCart={handleAddToCart} />
            </div>
        </div>
    )
}
