import { useState } from 'react'
import { Address } from '@arishop/shared'
import { ActionButton } from '../Buttons/ActionButton'

interface DeliveryAddressBoxProps {
  address?: Address
  firstName?: string
  lastName?: string
  email?: string
  isSignedIn?: boolean
  onSave?: (address: Address) => void
  onGuestInfoSave?: (info: { firstName: string; lastName: string; email: string }) => void
  title?: string
  editable?: boolean
}

export const DeliveryAddressBox = ({
  address,
  firstName = '',
  lastName = '',
  email = '',
  isSignedIn = false,
  onSave,
  onGuestInfoSave,
  title = 'Delivery Address',
  editable = true
}: DeliveryAddressBoxProps) => {
  const [isEditing, setIsEditing] = useState(!address && editable !== false)

  const [formData, setFormData] = useState<Address>(
    address ?? {
      _id: '',
      street: '',
      apartment: '',
      city: '',
      country: 'IL',
      zip: '',
    }
  )

  const [guestInfo, setGuestInfo] = useState({
    firstName,
    lastName,
    email
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (['firstName', 'lastName', 'email'].includes(name)) {
      setGuestInfo((prev) => ({ ...prev, [name]: value }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSave = () => {
    if (!formData.street || !formData.apartment || !formData.city || !formData.zip) return
    if (!isSignedIn) {
      onGuestInfoSave?.(guestInfo)
    }
    onSave?.({ ...formData, country: 'IL' })
    setIsEditing(false)
  }

  return (
    <div className="delivery-address-box">
      <h3>{title}</h3>
      {isEditing ? (
        <form className="address-form">
          {!isSignedIn && (
            <>
              <input name="firstName" placeholder="First Name" value={guestInfo.firstName} onChange={handleChange} />
              <input name="lastName" placeholder="Last Name" value={guestInfo.lastName} onChange={handleChange} />
              <input name="email" placeholder="Email" value={guestInfo.email} onChange={handleChange} />
            </>
          )}
          <input name="street" placeholder="Street" value={formData.street} onChange={handleChange} />
          <input name="apartment" placeholder="Floor/Apartment" value={formData.apartment} onChange={handleChange} />
          <input name="city" placeholder="City" value={formData.city} onChange={handleChange} />
          <input name="zip" placeholder="Postal Code" value={formData.zip} onChange={handleChange} />
          <ActionButton label="Save" onClick={handleSave} />
        </form>
      ) : (
        <div className="address-preview">
          {!isSignedIn && (
            <>
              <p>{guestInfo.firstName}</p>
              <p>{guestInfo.lastName}</p>
              <p>{guestInfo.email}</p>
            </>
          )}
          <p>{formData.street}</p>
          <p>{formData.apartment}</p>
          <p>{formData.city}</p>
          <p>{formData.zip}</p>
          <p>IL</p>
          <div className="edit-button">
            <ActionButton label="edit" onClick={() => setIsEditing(true)} variant="secondary" />
          </div>
        </div>
      )}
    </div>
  )
}
