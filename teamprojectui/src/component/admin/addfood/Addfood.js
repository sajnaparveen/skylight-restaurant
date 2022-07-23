import React,{useEffect,useState} from "react";
import { Navigate, useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios';
import {useLocation} from 'react-router-dom';

const Addfood = ()=>{
    const[categoryData,setcategory] = useState([])
    const {state} = useLocation();
   
    console.log("addproductuser",state)
    const navigate = useNavigate()
    const [foodImage, setFoodImg] =useState();
    const [ fooditem, setFoodItem] = useState({
        foodName: "",
        ingredients:"",
        Price: "",
        quantity:"",
        offer:"",
        offerPrice:"",
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

    const formDataFun=(file,body={})=>{
        console.log("file",file)
        console.log("body",body)
        const formdata = new FormData

        formdata.append('file',file[0]);
        for (const key in body) {
            formdata.append(key,body[key]);
        }
        return formdata
    }

    const postDatas=()=>{
        // const headerconfig = {
        //     headers: { "Content-Type": "multipart/form-data","token":token },
        // }
        const retData = formDataFun(foodImage,fooditem)
        console.log("foodImage",foodImage)
       axios.post("http://192.168.1.4:7000/api/v2/food/add",retData,{
        headers:{"token":token,
       
    }
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
                     <input type="text" placeholder="foodName" value={fooditem.foodName} name="foodName" onChange={ handleChange } className="form-control "/>
                 </div>
                 </div>
                 <div className="from-row">
                 <div className="col-lg-7">
                     <input type="text" placeholder="ingredients" value={fooditem.ingredients} name="ingredients" onChange={ handleChange } className="form-control"/>
                 </div>
                 </div>
                 <div className="from-row">
                 <div className="col-lg-7">
                     <input type="text" placeholder="Price" value={fooditem.Price} name="Price" onChange={handleChange } className="form-control"/>
                 </div>
                 </div>
                 <div className="from-row">
                 <div className="col-lg-7">
                     <input type="text" placeholder="quantity" value={fooditem.quantity} name="quantity" onChange={ handleChange } className="form-control"/>
                 </div>
                 </div>
                 <div className="from-row">
                 <div className="col-lg-7">
                     <input type="text" placeholder="offer" value={fooditem.offer} name="offer" onChange={ handleChange } className="form-control"/>
                 </div>
                 </div>
                 <div className="from-row">
                 <div className="col-lg-7">
                     <input type="text" placeholder="offerPrice" value={fooditem.offerPrice} name="offerPrice" onChange={ handleChange } className="form-control"/>
                 </div>
                 </div>
                 <div className="from-row">
                 <div className="col-lg-7">
                     {/* <input type="text" placeholder="categoryUuid" value={fooditem.categoryUuid} name="categoryUuid" onChange={ handleChange } className="form-control"/> */}
                {
                     <select  name="categoryUuid" onChange={handleChange} >
                        {categoryData.map((data,index)=>{
                            return(
                                
                           <option key={index} value={data.uuid}>{data.uuid}</option>
                        
                            )
                         })} 
                   
                     </select>
}
                 </div>
                 </div>
                 {/* <div className="from-row">
                 <div className="col-lg-7">
                     <input type="text" placeholder="userUuid" value={fooditem.userUuid} name="userUuid" onChange={ handleChange } className="form-control"/>
                 </div>
                 </div> */}
                 <div className="from-row">
                 <div className="col-lg-7">
                     <input  type="file" value={fooditem.foodImage} name="foodImage" onChange={ (event)=>setFoodImg(event.target.files) } className="form-control"/>
                 </div>
                 </div>
                 <div className="from-row">
                 <div className="col-lg-7" >
                     <button type="button"  onClick={postDatas} className="btn1 mt-3 mb-5">Add Product</button>
                 </div>
                 </div>
                
             </form>
        

      </section> 

    )
}

export default Addfood