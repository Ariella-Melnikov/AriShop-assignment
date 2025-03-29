import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { AppHeader } from './components/AppHeader/AppHeader'
import { MainPage } from './pages/MainPage'
import { ShopPage } from './pages/ShopPage'
import { ProductPage } from './pages/ProductPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'

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
                                    <Route path='/' element={<MainPage />} />
                                    <Route path='/best-seller' element={<div>Best Seller Page</div>} />
                                    <Route path='/shop' element={<ShopPage />} />
                                    <Route path='/shop/:productId' element={<ProductPage />} />
                                    <Route path='/cart' element={<CartPage />} />
                                    <Route path='/philosophy' element={<div>Philosophy Page</div>} />
                                    <Route path='/contact' element={<div>Contact Page</div>} />
                                    <Route path='/checkout' element={<CheckoutPage />} />
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
