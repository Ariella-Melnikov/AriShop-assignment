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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (value: SortOption) => {
    onChange(value)
    setIsOpen(false)
  }

  return (
    <div className="sort-box" ref={boxRef}>
      <button className="sort-header" onClick={() => setIsOpen(!isOpen)}>
        <SortIcon className="sort-icon" />
        <span className="sort-title">Sort</span>
      </button>

      {isOpen && (
        <div className="sort-options">
          <Tag label="Best Sellers" isActive={active === 'best'} onClick={() => handleSelect('best')} />
          <Tag label="Price - High to Low" isActive={active === 'high-to-low'} onClick={() => handleSelect('high-to-low')} />
          <Tag label="Price - Low to High" isActive={active === 'low-to-high'} onClick={() => handleSelect('low-to-high')} />
        </div>
      )}
    </div>
  )
}