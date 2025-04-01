import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store/store'
import { fetchProducts, toggleTag, fetchTags, setSortOrder } from '../store/slices/productSlice'
import { ProductList } from '../components/ProductList/ProductList'
import { Product, Variant } from '@arishop/shared'
import { PageTitle } from '../components/Title/PageTitle'
import { SortBox } from '../components/SortTagBox/SortBox'
import { Banner } from '../components/Banner/Banner'
import shopHeroImg from '../assets/img/Shop-hero.png'
import { openCartModal } from '../store/slices/cartUiSlice'
import { addCartItem } from '../store/actions/cartActions'
import { TagBox } from '../components/SortTagBox/TagBox'

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

    const handleAddToCart = async (product: Product, variant: Variant) => {
        try {
            if (!product._id || !variant._id) {
                console.error('Invalid product or variant ID')
                return
            }

            console.log('Adding to cart:', {
                productId: product._id,
                variantId: variant._id,
                quantity: 1,
            })

            await dispatch(
                addCartItem({
                    productId: product._id,
                    variantId: variant._id,
                    quantity: 1,
                })
            ).unwrap()
            dispatch(openCartModal())
        } catch (error) {
            console.error('Failed to add item to cart:', error)
        }
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
                <PageTitle>All Bouquets</PageTitle>
            </div>

            <div className='tag-filters'>
                <div className='tag-buttons'>
                    <TagBox tags={allTags} selected={selectedTags} onToggle={(tag) => dispatch(toggleTag(tag))} />
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
