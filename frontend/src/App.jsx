import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import Collection from './pages/Collection';
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './pages/Product';
import Login from './pages/Login';
import PlaceOrder from './pages/PlaceOrder';
import Navbar from './components/Navbar';
import Cart from './pages/Cart';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import { ToastContainer, toast } from 'react-toastify';
import Verify from './pages/Verify';
import Profile from './pages/Profile';
import MyOrders from './components/MyOrders';
import ProfileInfo from './components/ProfileInfo';
import MyAddresses from './components/MyAddresses';
import ReceiptPage from './pages/ReceiptPage';


const App = () => {
  return (


    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        
        <Route path='/verify' element={<Verify />} />
        <Route path='/order/receipt/:orderId' element={<ReceiptPage />} />

        <Route path='/profile' element={<Profile />}>
          <Route index element={<ProfileInfo />} /> 
          <Route path='orders' element={<MyOrders />} /> 
          <Route path='addresses' element={<MyAddresses />} /> 
        </Route>
      </Routes>
      <Footer />
    </div>
  )
}

export default App