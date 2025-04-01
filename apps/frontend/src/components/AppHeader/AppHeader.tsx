import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { RootState } from '../../store/store'
import { closeCartModal } from '../../store/slices/cartUiSlice'
import { CartModal } from '../Modal/CartModal'
import AppLogo from '@/assets/icons/app-logo.svg?react'
import CartIcon from '@/assets/icons/cart-icon.svg?react'

export const AppHeader = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const [isSticky, setIsSticky] = useState(false)
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
    const showCartModal = useSelector((state: RootState) => state.cartUi.showCartModal)

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY
            setIsSticky(scrollPosition > 0)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (showCartModal) {
            const timer = setTimeout(() => {
                dispatch(closeCartModal())
            }, 20000) // 20 seconds
            return () => clearTimeout(timer)
        }
    }, [showCartModal, dispatch])

    useEffect(() => {
        if (showCartModal) {
            dispatch(closeCartModal())
        }
    }, [location.pathname])

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
                        <AppLogo className='app-logo' />
                </div>

                {/* Navigation */}
                <nav className={`nav-column ${isMobileNavOpen ? 'active' : ''}`}>
                    <ul className='nav-links'>
                    <li>
                            <NavLink to='/shop' onClick={() => setIsMobileNavOpen(false)}>
                                Shop
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/best-seller' onClick={() => setIsMobileNavOpen(false)}>
                                Best Seller
                            </NavLink>
                        </li>
                        {/* <li>
                            <NavLink to='/philosophy' onClick={() => setIsMobileNavOpen(false)}>
                                Philosophy
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/contact' onClick={() => setIsMobileNavOpen(false)}>
                                Contact
                            </NavLink>
                        </li> */}
                    </ul>
                </nav>

                {/* Cart */}
                <div className='cart-column'>
                    <div className='cart-button-wrapper'>
                        <NavLink to='/cart' className='cart-button'>
                            <CartIcon className='cart-icon' />
                        </NavLink>
                        {showCartModal && <CartModal onClose={() => dispatch(closeCartModal())} />}
                    </div>
                </div>
            </div>
        </header>
    )
}
