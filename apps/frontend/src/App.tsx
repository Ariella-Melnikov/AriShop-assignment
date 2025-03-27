import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppHeader } from './components/AppHeader/AppHeader';
import { MainPage } from "./pages/MainPage";
import { ShopPage } from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage'; 

function App() {
  return (
    <Router>
      <div className="app">
        <AppHeader />
        <main >
          <Routes>
            <Route path="/best-seller" element={<div>Best Seller Page</div>} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/:productId" element={<ProductPage />} />
            <Route path="/philosophy" element={<div>Philosophy Page</div>} />
            <Route path="/contact" element={<div>Contact Page</div>} />
            <Route path="/" element={<MainPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
