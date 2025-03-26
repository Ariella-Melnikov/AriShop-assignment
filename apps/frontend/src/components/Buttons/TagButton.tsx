import CloseIcon from '@/assets/icons/X.svg?react'

type TagProps = {
    label: string
    isActive?: boolean
    onClick?: () => void
}

export const Tag = ({ label, isActive = false, onClick }: TagProps) => {
    return (
        <button className={`tag ${isActive ? 'active' : ''}`} onClick={onClick}>
            {isActive && <CloseIcon className='tag-icon' />}
            <span>{label}</span>
        </button>
    )
}
