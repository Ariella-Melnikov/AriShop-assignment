import CloseIcon from '@/assets/icons/X.svg?react'

type TagProps = {
    label: string
    isActive?: boolean
    onClick?: () => void
    showCloseIcon?: boolean
    className?: string
  }
  
  export const Tag = ({ label, isActive = false, onClick, showCloseIcon = true, className = '' }: TagProps) => {
    return (
      <button className={`tag ${isActive ? 'active' : ''} ${className}`} onClick={onClick}>
        {isActive && showCloseIcon && <CloseIcon className='tag-icon' />}
        <span>{label}</span>
      </button>
    )
  }
