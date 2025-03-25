import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import AppLogo from '@/assets/icons/app-logo.svg?react'
import CartIcon from '@/assets/icons/cart-icon.svg?react'

export const AppHeader = () => {
    const [isSticky, setIsSticky] = useState(false)
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY
            setIsSticky(scrollPosition > 0)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className={`app-header ${isSticky ? 'sticky' : ''}`}>
            <div className='header-content'>
                {/* Hamburger */}
                <div
                    className={`hamburger-menu ${isMobileNavOpen ? 'active' : ''}`}
                    onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}>
                    <span className='hamburger-icon' />
                </div>

                {/* Logo */}
                <div className='logo-column'>
                    <NavLink to='/' className='logo-link'>
                        <AppLogo className='app-logo' />
                    </NavLink>
                </div>

                {/* Navigation */}
                <nav className={`nav-column ${isMobileNavOpen ? 'active' : ''}`}>
                    <ul className='nav-links'>
                        <li>
                            <NavLink to='/best-seller' onClick={() => setIsMobileNavOpen(false)}>
                                Best Seller
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/shop' onClick={() => setIsMobileNavOpen(false)}>
                                Shop
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/philosophy' onClick={() => setIsMobileNavOpen(false)}>
                                Philosophy
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/contact' onClick={() => setIsMobileNavOpen(false)}>
                                Contact
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                {/* Cart */}
                <div className='cart-column'>
                    <NavLink to='/cart' className='cart-button'>
                        <CartIcon className='cart-icon' />
                    </NavLink>
                </div>
            </div>
        </header>
    )
}
