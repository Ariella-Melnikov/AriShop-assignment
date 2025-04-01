// components/Loader/PageLoader.tsx
import AsteriaLogo from '@/assets/icons/asteria.svg?react'

export const PageLoader = () => {
    const brandName = 'Asteria'
  
    return (
      <div className="page-loader">
        <AsteriaLogo className="loader-logo" />
        <div className="loader-text">
          {brandName.split('').map((char, idx) => (
            <span key={idx} className="loader-letter" style={{ animationDelay: `${idx * 0.1}s` }}>
              {char}
            </span>
          ))}
        </div>
      </div>
    )
  }