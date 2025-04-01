import { useRef, useState, useEffect } from 'react'
import { Tag } from '../Buttons/TagButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTags } from '@fortawesome/free-solid-svg-icons'


type TagBoxProps = {
  tags: string[]
  selected: string[]
  onToggle: (tag: string) => void
}

export const TagBox = ({ tags, selected, onToggle }: TagBoxProps) => {
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

  return (
    <div className="tag-box" ref={boxRef}>
      <button className="tag-header" onClick={() => setIsOpen(!isOpen)}>
        <span className="tag-title">Filter</span>
        <FontAwesomeIcon icon={faTags} />
      </button>

      {isOpen && (
        <div className="tag-options">
          {tags.map((tag) => (
            <Tag
              key={tag}
              label={tag}
              isActive={selected.includes(tag)}
              onClick={() => onToggle(tag)}
              showCloseIcon={false}
              className="tag-sort"
            />
          ))}
        </div>
      )}
    </div>
  )
}