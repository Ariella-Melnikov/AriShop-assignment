import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppHeader } from './components/AppHeader/AppHeader';

function App() {
  return (
    <Router>
      <div className="app">
        <AppHeader />
        <main className="main-content">
          <Routes>
            <Route path="/best-seller" element={<div>Best Seller Page</div>} />
            <Route path="/shop" element={<div>Shop Page</div>} />
            <Route path="/philosophy" element={<div>Philosophy Page</div>} />
            <Route path="/contact" element={<div>Contact Page</div>} />
            <Route path="/" element={<div>Home Page</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
