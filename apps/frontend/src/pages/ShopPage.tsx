import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchProducts } from '../store/slices/productSlice';
import { ProductList } from '../components/ProductList/ProductList';
import { Product } from '@shared/types/product';

export const ShopPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { products, loading, error } = useSelector((state: RootState) => state.products);

    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, products.length]);

    const handleAddToCart = (product: Product) => {
        // TODO: Implement cart functionality
        console.log('Adding to cart:', product);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="shop-page">
            <h1>Our Products</h1>
            <ProductList products={products} onAddToCart={handleAddToCart} />
        </div>
    );
}; 