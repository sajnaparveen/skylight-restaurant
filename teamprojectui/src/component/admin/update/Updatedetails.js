// import './Register.css';
import React,{useState} from "react";
import {useLocation, useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios';

const UpdateDetails = ()=>{
const navigate=useNavigate()
const {state} = useLocation();
console.log("state",state)
const[foodName, setfoodName]=useState(state.foodName);
const[ingredients, setIngredients]= useState(state.ingredients);
const[Price, setPrice]= useState(state.Price);
const[offer, setoffer]= useState(state.discound);
const[offerPrice, setofferPrice]= useState(state.offerPrice);
const[quantity, setquantity]= useState(state.quantity);

    const updateProduct = async()=>{
        console.log("updateTheData");
        let data = {
            uuid:state.uuid,
            updateData:{
                foodName:foodName,
                ingredients:ingredients,
                Price: Price,
             quantity:quantity,
                offer:offer,
                offerPrice:offerPrice     
    
            }

        }
       let token= localStorage.getItem("token")
        const updateDetails = await axios.put(`http://192.168.1.4:7000/api/v2/food/update`, data, {
            headers:{"token": token}
           
        })
        console.log("updatedetails",updateDetails)
        if(updateDetails){
            navigate('/admin', {state: updateDetails.data.result})
        }
    }
    return(
        <section className="form my-4 mx-5">
  <button onClick={()=>navigate("/admin")}>Go Back</button>
        <form >
            <div className="from-row">
            <div className="col-lg-7">
                <input type="text" placeholder="foodName" value={foodName} name="foodName" onChange={(e)=>setfoodName(e.target.value)} className="form-control "/>
            </div>
            </div>
            <div className="from-row">
            <div className="col-lg-7">
                <input type="text" placeholder="ingredients" value={ingredients} name="ingredients" onChange={(e)=>setIngredients(e.target.value)} className="form-control"/>
            </div>
            </div>
            <div className="from-row">
            <div className="col-lg-7">
                <input type="text" placeholder="offer" value={offer} name="ingredients" onChange={(e)=>setoffer(e.target.value)} className="form-control"/>
            </div>
            </div>
            <div className="from-row">
            <div className="col-lg-7">
                <input type="text" placeholder="quantity" value={quantity} name="ingredients" onChange={(e)=>setquantity(e.target.value)} className="form-control"/>
            </div>
            </div>
            <div className="from-row">
            <div className="col-lg-7">
                <input type="text" placeholder="Price" value={Price} name="Price" onChange={(e)=>setPrice(e.target.value)} className="form-control"/>
            </div>
            </div>
            
           
            <div className="from-row">
            <div className="col-lg-7">
                <input type="text" placeholder="offerPrice" value={offerPrice} name="offerPrice" onChange={(e)=>setofferPrice(e.target.value)} className="form-control"/>
            </div>
            </div>
          
            <div className="from-row">
            <div className="col-lg-7" >
                <button type="button"  onClick={updateProduct} className="btn1 mt-3 mb-5">Update</button>
            </div>
            </div>
           
        </form>
   
 </section> 

    )
}

export default UpdateDetails;