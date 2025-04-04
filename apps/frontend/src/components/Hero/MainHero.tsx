import { NavLink } from 'react-router-dom'
import mainHeroImg from '@/assets/img/main-hero.png'
import ShopNowIcon from '@/assets/icons/shop-now.svg?react'

export const MainHero = () => {
    return (
      <section className="hero">
          <div
            className="hero-bg"
            style={{ backgroundImage: `url(${mainHeroImg})` }}
          ></div>
          <div className="shop-now">
            <NavLink to="/shop" className="shop-link">
              <ShopNowIcon className="shop-icon" />
            </NavLink>
          </div>
          <div className="hero-text">
            <span className="row-1">EVERY</span>
            <span className="row-2">FLOWER HAS A</span>
            <span className="row-3">STORY TO TELL</span>
          </div>
      </section>
    );
  };
