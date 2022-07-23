import logo from './logo.svg';
import './App.css';

import Login from './component/login/Login';
import Signup from './component/signup/Signup';
import { useRef, useState, useEffect } from "react";
import Admin from './component/admin/Admin';
import Food from './component/food/Food';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Addtocart from './component/addtocart/Addtocart';
import ViewDetails from './component/viewdetails/ViewDetails';
import UpdateDetails from './component/admin/update/Updatedetails';
import Addfood from './component/admin/addfood/Addfood';
import AdminViewDetails from './component/admin/adminviewdetails/AdminViewDetails';
import Addcategorys from './component/admin/addcategory/AddCategory';
import Payment from './component/payment/Payment';

import TableBooking from './component/table-booking/table-booking';
function App() {
 
 
  return (
      <div >
     
    <Router>
      <Routes>
       <Route path="/" element={<Signup/>} />
       <Route path="/login" element={<Login/>} />
       <Route path="/home" element={<Food/>} />
       <Route path="/addtocart"  element={<Addtocart />} />
       <Route path="/admin"  element={<Admin />} />
       <Route path="/viewdetails"  element={<ViewDetails />} />
       <Route path="/updatedetails"  element={<UpdateDetails />} />
       <Route path="/Addfood"  element={<Addfood />} />
       <Route path='/AdminViewDetails' element={<AdminViewDetails/>}/>
       <Route path='/Addcategory' element={<Addcategorys/>}/>
       <Route path='/payment' element={<Payment/>}/>
       <Route path='/table-booking' element={<TableBooking/>}/>
      </Routes>
    </Router>
   
     </div>
  );
}

export default App;
