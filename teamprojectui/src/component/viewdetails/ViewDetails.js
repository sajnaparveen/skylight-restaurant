import React from "react";
import { useNavigate } from 'react-router-dom'

import {Link,useLocation} from 'react-router-dom';
const ViewDetails=()=>{
    const navigate=useNavigate()
    const {state} = useLocation();
    console.log(state,"sdgsrtgtr")
    const updateData = ()=>{
        navigate('/updatedetails',{state: state})
    }
    return(
//         <div>
//   <table className="table">

//   <thead>
//                 <tr>
//                     <th>Food Name</th>
//                     <th>Description</th>
//                     <th>Price</th>
                  
//                     <th>FoodImage</th>

//                 </tr>
//             </thead>

//             <tbody>
//             <br></br>
//                 <tr>
//                     <td>{state.foodName}</td>
//                     <td>{state.ingredients}</td>
//                     <td>{state.Price}</td>
//                     {/* <td>{state.quantity}</td> */}
//                     <td>{state.OfferPrice}</td>
//                     {/* <td>{state.discoundPrice}</td> */}
//                     <td> <img src={state.foodImage} className="productimg"  alt="" /></td>
//                     <Link to='/itemdetails/updatedetails' state={state}>
//                     <button className="update" onClick={()=>updateData()} >UpdateDetails</button>
//                     </Link>
//                 </tr>
//             </tbody>
          
//   </table>

 
//         </div> 

<section className="vh-100" style={{backgroundColor: "#746D69"}}>
<div className="container h-100">
  <div className="row d-flex justify-content-center align-items-center h-100">
    <div className="col">
    <button  onClick={()=>navigate('/home')}>Back</button>
      <p style={{color: "black"}}> <span className="h2" >{state.foodName} details </span></p>

      <div className="card mb-4">
        <div className="card-body p-4">

          <div className="row align-items-center">
            <div className="col-md-2">
              <img src={state.foodImage}
                className="img-fluid" alt="Generic placeholder image"/>
            </div>
            
            <div className="col-md-2 d-flex justify-content-center">
              <div>
                <p className="small text-muted mb-4 pb-2" >Name</p>
                <p className="lead fw-normal mb-0" style={{color: "black"}}><i className="fas fa-circle me-2" style={{color: "#fdd8d2"}}></i>
                  {state.foodName}</p>
              </div>
            </div>
            <div className="col-md-2 d-flex justify-content-center">
              <div>
                <p className="small text-muted mb-4 pb-2">Ingredients</p>
                <p className="lead fw-normal mb-0" style={{color: "black"}}>

                {state.ingredients}
                </p>
              </div>
            </div>
            <div className="col-md-2 d-flex justify-content-center">
              <div>
                <p className="small text-muted mb-4 pb-2">Price</p>
                <p className="lead fw-normal mb-0" style={{color: "black"}}>Rs.{state.Price}</p>
              </div>
            </div>
            
            <div className="col-md-2 d-flex justify-content-center">
              <div>
                <p className="lead fw-normal mb-0" >
                {/* <Link to='/viewdetails/updatedetails' > */}
                    {/* <button style={{marginLeft:"100px",marginTop:"5px"}} onClick={()=>updateData()}>UpdateFoodDetails</button> */}
                    {/* </Link> */}
                    </p>
              </div>
            </div>
           
          </div>

        </div>
      </div>
    </div>
  </div>
</div>


</section>
    )
}

export default ViewDetails;
