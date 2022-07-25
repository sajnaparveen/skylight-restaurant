import React,{useEffect,useState} from "react";

import { Navigate, useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios';
import {useLocation} from 'react-router-dom';

const Addcategorys = ()=>{
    const[categoryData,setcategory] = useState([])
    const {state} = useLocation();
   
    console.log("addproductuser",state)
    const navigate = useNavigate()
    const [ fooditem, setFoodItem] = useState({
        CategoryName: "",
        Description:"",
        userUuid:localStorage.getItem('uuid')
    })

    const handleChange = e => {
        const { name, value } = e.target
        setFoodItem({

            ...fooditem,
            [name]: value
        })
    }
    const token=localStorage.getItem('token')
    const postDatas=()=>{
        console.log("fooditem",fooditem)
       axios.post("http://192.168.1.4:7000/api/v2/food/addfoodcategory",fooditem,{
        headers:{"token":token}
       }
       )
       .then((Response)=>{
        console.log("response",Response)
        if(Response){
            navigate("/admin",{state:{uuid:Response.data.result.userUuid}})
        }
       }).catch((error)=>{
  console.log(error)
       })
     }
     const categorys=()=>{
        axios.get("http://192.168.1.4:7000/api/v2/food/getfoodcategory")
        .then((res)=>{
         // alert(res.data.message)
         setcategory(res.data.result)

 console.log("category",res.data.result)
        }).catch((error)=>{
   console.log(error)
        })
      }
      useEffect(()=>{
        categorys()
        
      },[])
    return(
       
      <section className="form my-4 mx-5">
  <button onClick={()=>navigate("/admin")}>Go Back</button>
             <form >
                 <div className="from-row">
                 <div className="col-lg-7">
                     <input type="text" placeholder="CategoryName" value={fooditem.CategoryName} name="CategoryName" onChange={ handleChange } className="form-control "/>
                 </div>
                 </div>
                 <div className="from-row">
                 <div className="col-lg-7">
                     <input type="text" placeholder="Description" value={fooditem.Description} name="Description" onChange={ handleChange } className="form-control"/>
                 </div>
                 </div>
    
                 <div className="from-row">
                 <div className="col-lg-7" >
                     <button type="button"  onClick={postDatas} className="btn1 mt-3 mb-5">Add Category</button>
                 </div>
                 </div>
                
             </form>
        

      </section> 

    )
}

export default Addcategorys