import { useRef, useState, useEffect } from 'react'
import SortIcon from '@/assets/icons/sort-icon.svg?react'
import { Tag } from '../Buttons/TagButton'

type SortOption = 'best' | 'high-to-low' | 'low-to-high'

type SortBoxProps = {
  active: SortOption
  onChange: (value: SortOption) => void
}

export const SortBox = ({ active, onChange }: SortBoxProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const sortOptions: { label: string; value: SortOption }[] = [
    { label: 'Best Sellers', value: 'best' },
    { label: 'Price - High to Low', value: 'high-to-low' },
    { label: 'Price - Low to High', value: 'low-to-high' },
  ]

  const handleSelect = (value: SortOption) => {
    onChange(value)
    setIsOpen(false)
  }

  return (
    <div className="sort-box" ref={boxRef}>
      <button className="sort-header" onClick={() => setIsOpen(!isOpen)}>
        <span className="sort-title">Sort</span>
        <SortIcon className="sort-icon" />
        
      </button>

      {isOpen && (
      <div className="sort-options">
        {sortOptions.map(({ label, value }) => (
          <Tag
            key={value}
            label={label}
            isActive={active === value}
            onClick={() => handleSelect(value)}
            showCloseIcon={false}
            className='tag-sort'
          />
        ))}
      </div>
    )}
  </div>
  )
}