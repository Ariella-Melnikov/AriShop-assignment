import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

export const AppHeader = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsSticky(scrollPosition > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`app-header ${isSticky ? 'sticky' : ''}`}>
      <div className="header-content">
        {/* Logo Column */}
        <div className="header-column logo-column">
          <div className="logo-placeholder">Logo</div>
        </div>

        {/* Navigation Column */}
        <nav className="header-column nav-column">
          <ul className="nav-links">
            <li>
              <NavLink to="/best-seller">Best Seller</NavLink>
            </li>
            <li>
              <NavLink to="/shop">Shop</NavLink>
            </li>
            <li>
              <NavLink to="/philosophy">Philosophy</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
          </ul>
        </nav>

        {/* Cart Column */}
        <div className="header-column cart-column">
          <a href="/cart" className="cart-icon">
            Cart
          </a>
        </div>
      </div>
    </header>
  );
}; 