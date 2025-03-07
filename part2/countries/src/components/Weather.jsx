const Weather = ({ capital, weather }) => {

    if (!weather) {
        return null
    }

    return (
        <div>
            <h3>Weather in {capital}</h3>
            <div>
                <p>Temperature {weather.main.temp} Celsius</p>
                <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
                <p>Wind {weather.wind.speed} m/s</p>
            </div>
        </div>
    )
}

export default Weather