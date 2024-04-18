// import React from 'react'
// import Main from './sections/Main'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './sections/Sidebar'
import Main from './sections/Main'
import Layout from './components/Shared/Layout'
import Dashboard from './components/Dashboard'
import Product from './components/Product'
import Products from './components/Products'
import Orders from './components/Order/Orders'
import PageNotFound from "./components/PageNotFound/PageNotFound"
import { create } from 'zustand'
import Lines from './components/Lines'
import References from './components/References'
import Parameters from './components/Parameters'
import LastStations from './components/LastStations'
// import CollapsibleTable from './components/CollapsibleTable'

const App = () => {
  
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='products' element={<Products />} />
          <Route path='orders' element={<Orders />} />
          <Route path='Lines' element={<Lines />} />
          <Route path='References' element={<References />} />
          <Route path='Parameters' element={<Parameters />} />
          <Route path='LastStations' element={<LastStations />} />
          {/* <Route path='CollapsibleTables' element={<CollapsibleTable/>} /> */}
          
        </Route>
        <Route path='login' element={<div>This login page</div>} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
    // <main className="w-full bg-slate-200 h-screen flex justify-between items-start">
    //   <Sidebar />
    //   <Main />
    // </main>

  )
}

export default App