import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './components/landing'
import Home from './components/home'
import Next from './components/trackProject'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/track' element={<Next/>}/>
      </Routes>
    </div>
  )
}

export default App
