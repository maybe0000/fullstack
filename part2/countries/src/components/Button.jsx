import { useState } from "react"

const Button = ({ country, showCountry }) => {
    const [showToggle, setShowToggle] = useState(false)

    return (
        <div className="button-country">
            <button className={`btn ${showToggle ? 'btn-hide' : 'btn-show'}`} onClick={() => setShowToggle(previousToggle => !previousToggle)}>{showToggle ? 'Hide' : 'Show'}</button>
            {showToggle ? showCountry(country) : null}
        </div>
    )
}

export default Button