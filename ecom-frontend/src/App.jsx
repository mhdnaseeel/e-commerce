import React, { useState } from 'react'
import './App.css'
import Products from './pages/Products'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './layouts/Navbar'
import About from './pages/About'
import Contact from './pages/Contact'
import { Toaster } from 'react-hot-toast'
import Cart from './pages/Cart'
import LogIn from './pages/auth/LogIn'
import PrivateRoute from './routes/PrivateRoute'
import Register from './pages/auth/Register'
import Checkout from './pages/checkout/Checkout'
import PaymentConfirmation from './pages/checkout/PaymentConfirmation'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import Sellers from './pages/admin/Sellers'
import Category from './pages/admin/Categories'
import Orders from './pages/admin/Orders'
import Profile from './pages/profile/Profile'
import UserOrders from './pages/profile/UserOrders'
import UserManagement from './pages/admin/UserManagement'

function App() {
  return (
    <React.Fragment>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={ <Home />}/>
          <Route path='/products' element={ <Products />}/>
          <Route path='/about' element={ <About />}/>
          <Route path='/contact' element={ <Contact />}/>
          <Route path='/cart' element={ <Cart />}/>
        
          <Route path='/' element={<PrivateRoute />}>
            <Route path='/checkout' element={ <Checkout />}/>
            <Route path='/order-confirm' element={ <PaymentConfirmation />}/>
            <Route path='/profile' element={<Profile />} />
            <Route path='/profile/orders' element={<UserOrders />} />
          </Route>

          <Route path='/' element={<PrivateRoute publicPage />}>
            <Route path='/login' element={ <LogIn />}/>
            <Route path='/register' element={ <Register />}/>
          </Route>

           <Route path='/' element={<PrivateRoute adminOnly />}>
            <Route path='/admin' element={ <AdminLayout />}>
              <Route path='' element={<Dashboard />} />
              <Route path='products' element={<AdminProducts />} />
              <Route path='sellers' element={<Sellers />} />
              <Route path='orders' element={<Orders />} />
              <Route path='categories' element={<Category />} />
              <Route path='users' element={<UserManagement />} />
            </Route>
          </Route>
        </Routes>
      </Router>
      <Toaster position='bottom-center'/>
    </React.Fragment>
  )
}

export default App
