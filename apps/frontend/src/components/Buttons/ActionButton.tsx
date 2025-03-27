type ActionButtonProps = {
    label: string
    onClick?: () => void
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    variant?: 'primary' | 'secondary'
}

export const ActionButton = ({ label, onClick, type = 'button', disabled, variant = 'primary' }: ActionButtonProps) => {
    return (
        <button
            className={`action-button ${variant} ${disabled ? 'disabled' : ''}`}
            onClick={onClick}
            type={type}
            disabled={disabled}>
            {label}
        </button>
    )
}
