import axios from 'axios'
import { useEffect, useState } from 'react'
import './App.css'
import Button from './components/Button'
import Country from './components/Country'

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_KEY
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather'
const GEOCODING_API_URL = 'http://api.openweathermap.org/geo/1.0/direct'

const App = () => {
  const [value, setValue] = useState('')
  const [message, setMessage] = useState('')
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState(null)

  // what if API can't be reached

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
  }, [])

  const filteredCountries = countries.filter(c => c.name.common.toLowerCase().includes(value.toLowerCase()))
  const filteredCountriesLen = filteredCountries.length

  useEffect(() => {
    if (filteredCountriesLen > 10 && value.length) {
      setMessage('Too many matches, specify another filter')
    }
    else {
      setMessage('')
    }
  }, [filteredCountriesLen])

  useEffect(() => {
    if (filteredCountriesLen === 1) {
      const fetchWeather = async () => {
        try {
          const geoResponse = await axios.get(GEOCODING_API_URL, {
            params: {
              q: filteredCountries[0].capital[0],
              appid: WEATHER_API_KEY
            }
          })

          const lat = geoResponse.data[0].lat
          const lon = geoResponse.data[0].lon

          const weatherResponse = await axios.get(WEATHER_API_URL, {
            params: {
              lat: lat,
              lon: lon,
              units: 'metric',
              appid: WEATHER_API_KEY
            }
          })
          setWeather(weatherResponse.data)
        }
        catch (error) {
          console.error('Error fetching weather: ', error)
        }
      }
      fetchWeather();
    }
  }, [filteredCountriesLen])

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  const onSearch = (e) => {
    e.preventDefault()
    setCountry(value.toLowerCase())
  }

  const showCountry = (country) => {
    return (
      <Country country={country} weather={weather} />
    )
  }

  return (
    <div>
      <form onSubmit={onSearch}>
        find countries: <input value={value} onChange={handleChange} id="country-input" />
      </form>
      {message === '' ? null : <p>{message}</p>}
      {countries.length && value.length && filteredCountriesLen === 1 ? <><Country country={filteredCountries[0]} weather={weather} /></> :
        countries.length && value.length && filteredCountriesLen <= 10 ? filteredCountries.map(c => <div key={c.name.common} className='show-country'>{c.name.common}<Button country={c} showCountry={showCountry} /></div>) : null}
    </div>
  )

}

export default App

