import axios from 'axios'
import { useEffect, useState } from 'react'
import './App.css'

const App = () => {
  const [value, setValue] = useState('')
  const [country, setCountry] = useState(null)
  const [countryData, setCountryData] = useState({})
  const [message, setMessage] = useState('')
  const [countries, setCountries] = useState([])

  const displayMessage = () => {
    setMessage('Country not found.')
    setTimeout(() => {
      setMessage('')
    }, 5000)
  }

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
  }, [])

  // skip if country is not defined
  useEffect(() => {
    if (country) {
      console.log('fetching country data...')
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
        .then(response => {
          setCountryData(response.data)
          setMessage('')
        })
        .catch(err => {
          setCountryData({})
          console.error('Country not found', err)
          displayMessage()
          setValue('')
          setCountry(null)
        })
    }
  }, [country])

  const handleChange = (e) => {
    setValue(e.target.value)
    // console.log('handleChange ', value)
  }

  const onSearch = (e) => {
    e.preventDefault()
    setCountry(value.toLowerCase())
    // console.log('onSearch ', country)
  }

  return (
    <div>
      <form onSubmit={onSearch}>
        find countries: <input value={value} onChange={handleChange} />
      </form>
      {message === '' ? null : <p>{message}</p>}
      {Object.keys(countryData).length ? <div>{countryData.name.common}</div> : null}
      {countries.length && value.length ? countries.filter(c => c.name.common.toLowerCase().includes(value.toLowerCase())).map(c => <div key={c.name.common}>{c.name.common}</div>) : null}
    </div>
  )

}

export default App

