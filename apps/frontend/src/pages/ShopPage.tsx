import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store/store'
import { fetchProducts, toggleTag, fetchTags, setSortOrder } from '../store/slices/productSlice'
import { ProductList } from '../components/ProductList/ProductList'
import { Product } from '@arishop/shared'
import { Title } from '../components/Title/Title'
import { Tag } from '../components/Buttons/TagButton'
import { SortBox } from '../components/SortBox/SortBox'
import { Banner } from '../components/Banner/Banner'
import shopHeroImg from '../assets/img/Shop-hero.png'

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

    const handleAddToCart = (product: Product) => {
        // TODO: Implement cart functionality
        console.log('Adding to cart:', product)
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
                <ProductList products={filteredProducts} onAddToCart={handleAddToCart} />
            </div>
        </div>
    )
}
