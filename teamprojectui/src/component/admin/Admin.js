import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import './Admin.css'
import Swal from 'sweetalert2'

const Admin = () => {
  const [fooditem, setfooditem] = useState([]);
  const [foodcategory, setfoodcategory] = useState([]);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [deleteData, setDelete] = useState(null)
  const [deleteCategory, setdeleteCategory] = useState(null)
  const[searchData,setSearchData] = useState([])

  // const { state } = useLocation();
 const state= localStorage.getItem('uuid')
 
  console.log("state",state)

  const logout = () => {
    Swal.fire({
      title: 'Do you want to Logout?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'YES',
      cancelButtonText: 'NO'
    }).then((result) => {
      console.log(result)
      if (result.value) {
        localStorage.clear("token")
        navigate("/login")
        console.log(localStorage.getItem("token"))
      }
    })

  }
  //get all food item list
  const getfood = () => {
    axios.get("http://192.168.1.4:7000/api/v2/food/getallitem").then((res) => {
      // console.log(res.data.result)
      setfooditem(res.data.result)
    }).catch((error) => {
      console.log(error)
    })
  }

 //get all category item list
  const foodcategorys = () => {
    axios.get("http://192.168.1.4:7000/api/v2/food/getfoodcategory").then((res) => {
      // console.log("category",res.data.result)
      setfoodcategory(res.data.result)
    }).catch((error) => {
      console.log(error)
    })
  }

  //search
  const searchproduct = (key) => {
    console.log(key)
    if(key){
      axios.get('http://192.168.1.4:7000/api/v2/food/searchproduct/' + key, {
     
      })
        .then((res) => {
  
          setfooditem(res.data.result)
      
          console.log("search", res.data.result)
        }).catch((error) => {
          console.log(error)
        })
    }
  
 
  }
  const searchProduct = () =>{
    console.log('-------------------')
    axios.get(`http://192.168.1.4:7000/api/v2/food/search?Brandname=${data}`).then(result=>{
        console.log('data',result.data);
        navigate('/product',{state:result.data})
    }).catch(err=>{
        console.log("err",err.message)
    })
}

  //delete food item
  const deleteproduct = async (data) => {
    const token = localStorage.getItem('token')
    getfood()
    // console.log("data", data)
    await axios.delete(`http://192.168.1.4:7000/api/v2/food/delete/${data}`, {
      headers: { "token": token }
    })
      .then((res) => {
        setDelete("delete")
        // console.log(res)
      }).catch((error) => {
        console.log(error)
      })
  }

  //delete category
  const deletecategorys = async (data) => {
    const token = localStorage.getItem('token')
    getfood()
    foodcategorys()
    console.log("data", data)
    await axios.delete(`http://192.168.1.4:7000/api/v2/food/deletecategory/${data}`, {
      headers: { "token": token }
    })
      .then((res) => {
        setdeleteCategory("delete")

        console.log(res)
      }).catch((error) => {
        console.log(error)
      })
  }

  //get indiv food details
  const getIndivData = async (data) => {
    const token = localStorage.getItem('token')
    console.log(data)
    
    await axios.get(`http://192.168.1.4:7000/api/v2/food/getIndifooddetails?food_uuid=${data}`, {
      headers: { "token": token }
    })
      .then((res) => {
        if (res.data.result) {

          console.log("deatilss", res.data.result)
          navigate('/AdminViewDetails', { state: res.data.result })
        }
        console.log("indivproductdetails", res.data)
      }).catch((error) => {
        console.log(error)
      })
  }


  let cartItems = []
  const [cart, setcart] = useState([]);
  function addtocart(curElem) {
    // cartItems.push(curElem)
    console.log("regtrg", curElem)

    if (cart.indexOf(curElem) !== -1) return;
    setcart([...cart, curElem]);
    console.log("cart", cart)

    console.log("curElem", curElem)
  }

  useEffect(() => {
    getfood()
    foodcategorys()
    deleteproduct()
    deletecategorys()
    if(!localStorage.getItem('token')){
      navigate("/login")
  }
    // cart()
    // getProducts()
  }, [deleteCategory,deleteData]);
  return (
    <div>
      <div id="topbar" className="d-flex align-items-center fixed-top">
        <div className="container d-flex justify-content-center justify-content-md-between">
        </div>
      </div>
      {/* <!-- ======= Header ======= --> */}
      <header id="header" className="fixed-top d-flex align-items-cente">
        <div className="container-fluid container-xl d-flex align-items-center justify-content-lg-between">
          <h1 className="logo me-auto me-lg-0"><a href="index.html">Admin</a></h1>
          <div className="container-fluid container-xl d-flex align-items-center justify-content-lg-between">

<h1 className="logo me-auto me-lg-0"><a href="index.html">Restaurantly</a></h1>

<nav id="navbar" className="navbar order-last order-lg-0">
 
  
</nav>

<a href="#book-a-table" className="book-a-table-btn scrollto d-none d-lg-flex" onClick={logout}>LogOut</a>

</div>
        </div>
        
      </header>
      {/* <!-- End Header --> */}

      {/* <!-- ======= Menu Section ======= --> */}
      <section id="menu" className="menu section-bg">
        <div className="container" data-aos="fade-up">

          <div className="section-title">
            {/* <h2>Menu</h2> */}                                    
            <p>Check Our Tasty Menu   <input type="text" className="search-box" onChange={(key) => searchproduct(key.target.value)} placeholder="Search" /></p>
              {/* <input type="text"   className="search-box" onChange={(key)=>setSearchData(key.target.value)} placeholder="search products and categorys "/> */}

            {/* <button className="search-btn" type="submit" onClick={()=>searchproduct(searchData)}  value="search" >search</button> */}

          </div>

          <div className="row" data-aos="fade-up" data-aos-delay="100">
            <div className="col-lg-12 d-flex justify-content-center">
              <ul id="menu-flters">


                {
                  foodcategory.map((curElem, index) => {
                    return (
                      <li key={index} >
                        <li data-filter=".filter-starters">{curElem.CategoryName}</li><button onClick={() => deletecategorys(curElem.uuid)} >-</button>
                      </li>

                    )
                  })
                }
                <button onClick={()=>navigate("/Addcategory",{state: state})}>+</button>
              </ul>
            </div>
          </div>
          <div className="row menu-container" data-aos="fade-up" data-aos-delay="200">
            {
              fooditem.map((curElem, index) => {
                // console.log("sdfer ",curElem.foodName)
                return (

                  <div className="col-lg-6 menu-item filter-starters" key={index}>
                    <img src={'http://localhost:7000/'+curElem.foodImage} className="menu-img " alt="" />
                    <div className="menu-content">
                      <span>{curElem.foodName}</span><span>Rs.{curElem.Price}</span>
                      <span className="delete" style={{backgroundColor: "white"}} onClick={() => deleteproduct(curElem.uuid)}>Delete</span>                                                                                  
                      <span className="view" onClick={() => getIndivData(curElem.uuid)}>ViewDetails</span>
                     
                    </div>
                    <div className="menu-ingredients">
                      {curElem.ingredients}
                    </div>                        
                  </div>
                )
              })
            }
            <button className="addbutton" onClick={()=>navigate("/Addfood",{state: state})}>+</button>
          </div>

        </div>
      </section>


    </div>
  )
}
export default Admin