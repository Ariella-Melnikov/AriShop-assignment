import { useState, useImperativeHandle, forwardRef } from 'react'
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
export interface DeliveryAddressBoxHandle {
  validateForm: () => boolean
}

export const DeliveryAddressBox = forwardRef<DeliveryAddressBoxHandle, DeliveryAddressBoxProps>(
  (
    {
      address,
      firstName = '',
      lastName = '',
      email = '',
      isSignedIn = false,
      onSave,
      onGuestInfoSave,
      title = 'Delivery Address',
      editable = true,
    },
    ref
  ) => {
    const [isEditing, setIsEditing] = useState(!address && editable !== false)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [guestInfo, setGuestInfo] = useState({ firstName, lastName, email })

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

    const validateForm = () => {
      const newErrors: { [key: string]: string } = {}

      if (!formData.street.trim()) newErrors.street = 'Street is required'
      if (!formData.apartment.trim()) newErrors.apartment = 'Apartment is required'
      if (!formData.city.trim()) newErrors.city = 'City is required'
      if (!formData.zip.trim()) newErrors.zip = 'Postal code is required'

      if (!isSignedIn) {
        if (!guestInfo.firstName.trim()) newErrors.firstName = 'First name is required'
        if (!guestInfo.lastName.trim()) newErrors.lastName = 'Last name is required'
        if (!guestInfo.email.trim()) newErrors.email = 'Email is required'
        else if (!/^\S+@\S+\.\S+$/.test(guestInfo.email)) newErrors.email = 'Invalid email format'
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

    useImperativeHandle(ref, () => ({
      validateForm,
    }))

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      if (['firstName', 'lastName', 'email'].includes(name)) {
        setGuestInfo((prev) => ({ ...prev, [name]: value }))
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }))
      }

      // Clear error as user types valid value
      setErrors((prev) => {
        const newErrors = { ...prev }

        if (value.trim()) {
          if (name === 'email') {
            if (/^\S+@\S+\.\S+$/.test(value)) delete newErrors[name]
          } else {
            delete newErrors[name]
          }
        }

        return newErrors
      })
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const { name, value } = e.target

      setErrors((prev) => {
        const newErrors = { ...prev }

        if (!value.trim()) {
          newErrors[name] = `${name[0].toUpperCase() + name.slice(1)} is required`
        } else if (name === 'email' && !/^\S+@\S+\.\S+$/.test(value)) {
          newErrors.email = 'Invalid email format'
        } else {
          delete newErrors[name]
        }

        return newErrors
      })
    }

    const handleSave = () => {
      if (!validateForm()) return

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
                <input name="firstName" placeholder="First Name" value={guestInfo.firstName} onChange={handleChange} onBlur={handleBlur}/>
                {errors.firstName && <span className="error">{errors.firstName}</span>}
                <input name="lastName" placeholder="Last Name" value={guestInfo.lastName} onChange={handleChange} onBlur={handleBlur}/>
                {errors.lastName && <span className="error">{errors.lastName}</span>}
                <input name="email" placeholder="Email" value={guestInfo.email} onChange={handleChange} onBlur={handleBlur}/>
                {errors.email && <span className="error">{errors.email}</span>}
              </>
            )}
            <input name="street" placeholder="Street" value={formData.street} onChange={handleChange} onBlur={handleBlur}/>
            {errors.street && <span className="error">{errors.street}</span>}
            <input name="apartment" placeholder="Floor/Apartment" value={formData.apartment} onChange={handleChange} onBlur={handleBlur}/>
            {errors.apartment && <span className="error">{errors.apartment}</span>}
            <input name="city" placeholder="City" value={formData.city} onChange={handleChange} onBlur={handleBlur}/>
            {errors.city && <span className="error">{errors.city}</span>}
            <input name="zip" placeholder="Postal Code" value={formData.zip} onChange={handleChange} onBlur={handleBlur}/>
            {errors.zip && <span className="error">{errors.zip}</span>}
            <ActionButton label="Save" onClick={handleSave} variant="secondary" />
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
)
export default DeliveryAddressBox

