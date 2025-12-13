import React from 'react'
import UserLogin from './pages/UserLogin'
import StockList from './components/stockList'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import CreateStock from './pages/CreateStock'
import Home from './pages/Home'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path = "/login" element ={<UserLogin/>}/>
        <Route path="/stocks" element={<StockList />} />
        <Route path="/create" element={<CreateStock />} />
      </Routes>
    </Router>
  )
}

export default App
