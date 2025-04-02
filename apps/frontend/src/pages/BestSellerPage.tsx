import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store/store'
import { openCartModal } from '../store/slices/cartUiSlice'
import { addCartItem } from '../store/actions/cartActions'
import { fetchProducts, toggleTag, fetchTags, setSortOrder } from '../store/slices/productSlice'
import { ProductList } from '../components/ProductList/ProductList'
import { PageTitle } from '../components/Title/PageTitle'
import { SortBox } from '../components/SortTagBox/SortBox'
import { TagBox } from '../components/SortTagBox/TagBox'
import { Banner } from '../components/Banner/Banner'
import { PageLoader } from '../components/Loader/PageLoader'
import { Product, Variant } from '@arishop/shared'
import bestSellerImg from '../assets/img/best-seller.png'

export const BestSellerPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { loading, error } = useSelector((state: RootState) => state.products)
    const { products, allTags, selectedTags, sortOrder } = useSelector((state: RootState) => state.products)

    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts())
            dispatch(fetchTags())
        }
    }, [dispatch, products.length])

    const bestSellerProducts = products.filter((p) => p.isBestSeller)

    const filteredByTags = selectedTags.length
        ? bestSellerProducts.filter((p) => p.tags.some((tag) => selectedTags.includes(tag)))
        : bestSellerProducts

    const sortedProducts = [...filteredByTags].sort((a, b) => {
        const getMediumPrice = (product: Product) =>
            product.variants.find((v) => v.size === 'medium')?.price.amount ?? 0

        switch (sortOrder) {
            case 'low-to-high':
                return getMediumPrice(a) - getMediumPrice(b)
            case 'high-to-low':
                return getMediumPrice(b) - getMediumPrice(a)
            default:
                return 0
        }
    })

    const getBestAvailableVariant = (product: Product) => {
        const preferredOrder: ('medium' | 'small' | 'large')[] = ['medium', 'small', 'large']
        return (
            preferredOrder
                .map((size) => product.variants.find((v) => v.size === size && v.inventory.quantity > 0))
                .find(Boolean) || null
        )
    }

    const productCardsData = sortedProducts.map((product) => ({
        product,
        displayVariant: getBestAvailableVariant(product),
    }))

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
        return (
            <div className='loading'>
                <PageLoader />
            </div>
        )
    }
    if (error) return <div className='error'>{error}</div>

    return (
        <div className='shop-page'>
            <Banner imgUrl={bestSellerImg} />
            <div className='shop-title'>
                <PageTitle>Best Sellers</PageTitle>
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
