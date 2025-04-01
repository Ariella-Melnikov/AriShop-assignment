import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom'
import { AppHeader } from './components/AppHeader/AppHeader'
import { ShopPage } from './pages/ShopPage'
import { ProductPage } from './pages/ProductPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { SuccessPaymentPage } from './pages/SuccessPaymentPage'
import { BestSellerPage } from './pages/BestSellerPage'

function App() {    
    return (
        <Router>
            <Routes>
                <Route
                    path='/*'
                    element={
                        <div className='app'>
                            <AppHeader />
                            <main>
                                <Routes>
                                <Route path='/' element={<Navigate to="/shop" />} />
                                <Route path='/best-seller' element={<BestSellerPage />} />
                                    <Route path='/shop' element={<ShopPage />} />
                                    <Route path='/shop/:productId' element={<ProductPage />} />
                                    <Route path='/cart' element={<CartPage />} />
                                    {/* <Route path='/philosophy' element={<div>Philosophy Page</div>} />
                                    <Route path='/contact' element={<div>Contact Page</div>} /> */}
                                    <Route path='/success' element={<SuccessPaymentPage />} />
                                </Routes>
                            </main>
                        </div>
                    }
                />
                <Route path='/checkout' element={<CheckoutPage />} />
            </Routes>
        </Router>
    )
}

export default App
