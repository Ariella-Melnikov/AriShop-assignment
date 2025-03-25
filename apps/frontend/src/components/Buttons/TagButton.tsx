import { ReactComponent as CloseIcon } from '@/assets/icons/X.svg'

type TagProps = {
  label: string
  isActive?: boolean
  onClick?: () => void
}

export const Tag = ({ label, isActive = false, onClick }: TagProps) => {
  return (
    <button className={`tag ${isActive ? 'active' : ''}`} onClick={onClick}>
      <span>{label}</span>
      {isActive && <CloseIcon className="tag-icon" />}
    </button>
  )
}