import { useState, useEffect } from "react"
import axios from "axios"
const api_key = import.meta.env.VITE_API_KEY

const App = () => {
  const [countries, setCountries] = useState([])
  const [newFilter, setNewFilter] = useState("")
  const [weather, setWeather] = useState(null)

  const countriesToShow = countries.filter(country => country.name.common.toLowerCase().includes(newFilter.toLowerCase()))

  useEffect(() => {
    console.log("effect")
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(response => {
        console.log("promise fulfilled")
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
  if (countriesToShow.length === 1) {
    const capital = countriesToShow[0].capital?.[0]
    if (!capital) return

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`

    axios.get(url)
      .then(response => {
        setWeather(response.data)
        console.log(response.data)
      })
      .catch(err => console.error(err))
    } else {
      setWeather(null)
    }
}, [countriesToShow[0]?.capital])

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  return (
    <div>
      find countries <input value={newFilter} onChange={handleFilterChange}/>

      {countriesToShow.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ): countriesToShow.length > 1 ? (
        countriesToShow.map(country =>
          <li key={country.cca3}>{country.name.common} <button onClick={() => setNewFilter(country.name.common)}>Show</button></li>
        )
      ) : countriesToShow.length === 1 ? (
        <div>
          <h1>{countriesToShow[0].name.common}</h1>
          <p>Capital {countriesToShow[0].capital}</p>
          <p>Area {countriesToShow[0].area}</p> 
          <h2>Languages</h2>
          {Object.values(countriesToShow[0].languages).map(language =>
            <li key={language}>{language}</li>
          )}
          <img src={countriesToShow[0].flags.png} alt={countriesToShow[0].flags.alt} />
          
          {weather ? (
        <div>
          <h2>Weather in {countriesToShow[0].capital}</h2>
          <p>Temperature: {weather.main.temp} Celsius</p>
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
    ) : (
      <p>Loading weather...</p>
    )}
        </div>
      ) : null }

    </div>
  )
}

export default App