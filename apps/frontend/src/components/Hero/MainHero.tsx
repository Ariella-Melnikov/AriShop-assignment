import { NavLink } from 'react-router-dom'
import mainHeroImg from '@/assets/img/main-hero.png'
import ShopNowIcon from '@/assets/icons/shop-now.svg?react'

export const MainHero = () => {
    return (
      <section className="hero">
          {/* Background Image (Spanning Last 2 Columns & All Rows) */}
          <div
            className="hero-bg"
            style={{ backgroundImage: `url(${mainHeroImg})` }}
          ></div>
  
          {/* Shop Now Icon (Centered in Column 3, Row 2) */}
          <div className="shop-now">
            <NavLink to="/shop" className="shop-link">
              <ShopNowIcon className="shop-icon" />
            </NavLink>
          </div>
  
          {/* Text Rows (Spanning Across 5 Columns, Placed on Rows 6-8) */}
          <div className="hero-text">
            <span className="row-1">EVERY</span>
            <span className="row-2">FLOWER HAS A</span>
            <span className="row-3">STORY TO TELL</span>
          </div>
      </section>
    );
  };
