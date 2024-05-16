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
import LoginForm from './components/Users/LoginForm'
import LoadingPage from './components/Shared/LoadingPage'
import Users from './components/Users/Users'
import EditProfileForm from './components/Users/EditProfileForm'
import ChangePassword from './components/Users/ChangePassword'
import Errors from './components/Errors'
import Grafik from './components/Grafik'
// import CollapsibleTable from './components/CollapsibleTable'

const App = () => {
  
  return (
    <Router>
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Grafik />} />
        <Route path='products' element={<Products />} />
        <Route path='orders' element={<Orders />} />
        <Route path='Lines' element={<Lines />} />
        <Route path='Errors' element={<Errors />} />
        <Route path='References' element={<References />} />
        <Route path='Parameters' element={<Parameters />} />
        <Route path='LastStations' element={<LastStations />} />
        <Route path='LoadingPage' element={<LoadingPage />} />
        <Route path='Datas' element={<Dashboard />} />
        <Route path='Users' element={<Users />} />
        <Route path='Users/EditProfileForm' element={<EditProfileForm />} />
        <Route path='Users/ChangePassword' element={<ChangePassword />} />
        {/* <Route path='CollapsibleTables' element={<CollapsibleTable/>} /> */}
        
      </Route>
      <Route path='login' element={<div>This login page</div>} />
      <Route path="*" element={<PageNotFound />} />
      <Route path="LoginUser" element={<LoginForm />} />
    </Routes>
  </Router>
    // <main className="w-full bg-slate-200 h-screen flex justify-between items-start">
    //   <Sidebar />
    //   <Main />
    // </main>

  )
}

export default App