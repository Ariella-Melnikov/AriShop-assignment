type ActionButtonProps = {
    label: string
    onClick?: () => void
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }
  
  export const ActionButton = ({ label, onClick, type = 'button', disabled }: ActionButtonProps) => {
    return (
      <button
        className={`action-button ${disabled ? 'disabled' : ''}`}
        onClick={onClick}
        type={type}
        disabled={disabled}
      >
        {label}
      </button>
    )
  }