import axios from 'axios'
import { useEffect, useState } from 'react'
import './App.css'
import Country from './components/Country'

const App = () => {
  const [value, setValue] = useState('')
  const [country, setCountry] = useState(null)
  const [countryData, setCountryData] = useState({})
  const [message, setMessage] = useState('')
  const [countries, setCountries] = useState([])


  // what if API can't be reached

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
  }, [])

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
          setMessage('Country not found.')
          setValue('')
          setCountry(null)
        })
    }
  }, [country])

  const filteredCountries = countries.filter(c => c.name.common.toLowerCase().includes(value.toLowerCase()))
  const filteredCountriesLen = filteredCountries.length

  useEffect(() => {
    if (filteredCountriesLen > 10) {
      setMessage('Too many matches, specify another filter')
    }
    else {
      setMessage('')
    }
  }, [filteredCountriesLen])

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  const onSearch = (e) => {
    e.preventDefault()
    setCountry(value.toLowerCase())
  }

  return (
    <div>
      <form onSubmit={onSearch}>
        find countries: <input value={value} onChange={handleChange} id="country-input" />
      </form>
      {message === '' ? null : <p>{message}</p>}
      {countries.length && value.length && filteredCountriesLen === 1 ? <Country country={filteredCountries[0]} /> :
        countries.length && value.length && filteredCountriesLen <= 10 ? filteredCountries.map(c => <div key={c.name.common}>{c.name.common}</div>) : null}
    </div>
  )

}

export default App

