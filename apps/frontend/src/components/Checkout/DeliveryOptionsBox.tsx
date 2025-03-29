import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

export const DeliveryOptionsBox = () => {
    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + 7)

    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }

    const formattedDate = deliveryDate.toLocaleDateString('en-US', options)

    return (
        <div className="delivery-options-box">
            <h2>DELIVERY OPTIONS</h2>
            <div className="delivery-option">
                <FontAwesomeIcon icon={faCircleInfo} className="info-icon" />
                <label htmlFor="standard">
                    <strong>FREE Standard Delivery</strong>
                    <br />
                    Delivered on or before <span className="date">{formattedDate}</span>
                </label>
            </div>
        </div>
    )
}