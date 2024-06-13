import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Weather from './Weather'
import WeatherDetail from './WeatherDetail'

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<Weather/>}/>
          <Route path='/home' element={<Weather/>}/>
          <Route path='/weather/:location' element={<WeatherDetail/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App