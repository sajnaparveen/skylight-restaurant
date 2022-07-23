import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, googleLogout, GoogleOAuthProvider } from '@react-oauth/google';
import FacebookLogin from "react-facebook-login";
import jwt_decode from "jwt-decode";
import Swal from 'sweetalert2'
import axios from 'axios';
import './Login.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const USER_REGEX = /^[a-zA-Z]{3,24}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const Login = () => {
 const navigate = useNavigate();
  const userRef = useRef();
  const errRef = useRef();

  const [userName, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [newpassword, setnewPwd] = useState('')
  const [validnewPwd, setValidnewPwd] = useState(false);
  const [newpwdFocus, setnewPwdFocus] = useState(false);

  const [password, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setemailFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');

  const [otp, setOtp] = useState('')
  const [otpModel, setOtpmodel] = useState(false)
  const [checkotp, setcheckotp] = useState('')
  const [resetPass, setResetPass] = useState(false);

  const [otpSent, setOtpSent] = useState();

  useEffect(() => {

    setErrMsg('');
    setValidName(USER_REGEX.test(userName));
    setValidEmail(EMAIL_REGEX.test(email));
    setValidPwd(PWD_REGEX.test(password));
    setValidnewPwd(PWD_REGEX.test(newpassword))
    setValidMatch(newpassword === matchPwd);
  }, [userName, email, password, matchPwd, newpassword])

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = EMAIL_REGEX.test(email);
    const v2 = PWD_REGEX.test(password);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post('http://192.168.1.4:7000/api/v1/user/loginpage', { email, password })
      console.log(response)
      //clear state and controlled inputs
      //need value attrib on inputs for this 
      // setUser('');
      // setPwd('');
      localStorage.setItem("address",response.data.data.address)
      localStorage.setItem("token",response.data.data.jwttoken)
      localStorage.setItem("uuid",response.data.data.uuid)
      localStorage.setItem("email",response.data.data.email)
      let address=response.data.data.address
      console.log("ress",address)
      if(localStorage.getItem("token")){
        // console.log("ress",userRole)
        if(response.data.data.role==="admin"){
            console.log("res.data.data.uuid",response.data.data.uuid)
            navigate("/admin",{state:response.data.data.uuid})
        }else{
          console.log("address",response.data.data.address)
            navigate("/home",{state:{userRole:response.data.data.role,state1:address}})
        }
      }
    } catch (err) {
      console.log(err)
      errRef.current.focus();
    }
  }


  const verifyOtp = () => {
    // console.log('bdcjahdvuydg',otp)
    // console.log('hfjhg',checkotp)
    if (otp == checkotp) {
      console.log("true")
      setResetPass(true)
    } else {
      console.log("false")
      setResetPass(false)
    }
  }
  const resetAll = () => {



    setnewPwd('')
    setMatchPwd('')
    setResetPass(false)
    setOtpmodel(false)
    setOtp('')
    setEmail('')
  }
  const resetpassword = async () => {


    const updatePassword = await axios.post("http://192.168.1.4:7000/api/v1/user/forgetPassword", { email, password })

    console.log(updatePassword)

  }
  const checkemail = async () => {

    const registeremail = await axios.post("http://192.168.1.4:7000/api/v1/user/check-email", { email })
    console.log(registeremail)
    console.log("otp", registeremail.data.otp)
    if (registeremail.data.status) {
      console.log("true")
      setOtpmodel(true)
    } else {
      console.log("false")

      setOtpmodel(false)
    }
    let otp = registeremail.data.otp
    console.log("aaaaa", otp)
    setcheckotp(otp)

  }

  // Google login-----------------------------------------------------------------------

  const [showloginButton, setShowloginButton] = useState(true);
  const [showlogoutButton, setShowlogoutButton] = useState(false);
  const [phoneNumberVerifyied, setPhoneNumberVerifyied] = useState(false)

  const onLoginSuccess = async (res) => {

    console.log('Login Success:', res);
    let token = res.credential

    console.log("token", res.credential)
    let data = jwt_decode(res.credential)
    console.log("data", data)
    let googleEmail = data.email
    let given_name = data.given_name
    let family_name = data.family_name

    console.log("family_name : ", family_name)

    console.log("given_name : ", given_name)
    console.log("email : ", googleEmail)

    const registeremail = await axios.post("http://192.168.1.4:7000/api/v1/user/check-email", { email: googleEmail })
    console.log("emaillll", registeremail.data.status)
    console.log("sucess")
    if (registeremail.data.status==true) {
      console.log("signin")

      const response = await axios.post('http://192.168.1.4:7000/api/v1/user/loginpage', { email: googleEmail, password: "Google@1324", logintype: "google" })
      console.log("loginpage", response);
      localStorage.setItem("address",response.data.data.address)
      localStorage.setItem("token",response.data.data.jwttoken)
      localStorage.setItem("uuid",response.data.data.uuid)
      navigate("/home",{state:{userRole:response.data.data.role}})
      setShowloginButton(false);
    
      // setShowlogoutButton(true);

    } else {
      console.log("signup")

      const { value: text } = await Swal.fire({
        title: 'OTP VERIFICATION',
        input: 'number',
        inputLabel: 'Phone Number',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'Please Enter Phone Number!'
          }
        }
      })

      if (text) {
        const response = await axios.post('http://192.168.1.4:7000/api/v1/user/verify-number', { number: text })
        console.log("phone verify", response);
        setOtpSent(response.data.otp)
        console.log(response.data.otp)

        let otpData = response.data.otp


        // const otpCeck = response.opt

        const { value: otp } = await Swal.fire({
          title: 'Enter OTP Here',
          input: 'number',
          inputLabel: 'Your OTP',
          // inputValue: otpCeck,
          showCancelButton: false,
          inputValidator: (value) => {
            if (!value) {
              return 'Enter OTP Please'
            }
            console.log(otpData)
            console.log(value)
            if (value != otpData) {
              return 'Wrong OTP Please Enter Correct OTP!'
            }
          }
        })

        if (otp) {

          if (otpData == otp) {
            Swal.fire(
              'Phone number Verified!',
              '',
              'success'
            ).then(async function () {
              const response = await axios.post('http://192.168.1.4:7000/api/v1/user/signupPage',
                { userName: given_name, email: googleEmail,role:"user", password: "Google@1324", mobileNumber: "+91" + text, logintype: "google" })
              console.log("signupPage", response)
              if (response.data.status) {
                setShowloginButton(false);
                // setShowlogoutButton(true);
                navigate('/home',{userRole:response.data.data.role})
                console.log('Sajuma')
              }
            });
          }

        }
      }

    }
    console.log(phoneNumberVerifyied)
  };

  const onLoginFailure = (res) => {
    console.log('Login Failed:', res);
  };

  const logout = () => {
    googleLogout()
    alert("You have been logged out successfully");
    console.clear();
    setShowloginButton(true);
    setShowlogoutButton(false);
  };



  //------------------------------------------------------------------------

  
  return (
    <section className="vh-100" >
      <p ref={errRef} className={errMsg ? "8" : "offscreen"} aria-live="assertive">{errMsg}</p>
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black" >
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Login In</p>
                    <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>
                  

<div className="d-flex flex-row align-items-center mb-4">
                      <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                      <div className="form-outline flex-fill mb-0">
                        <input placeholder="Email"
                          type="text"
                          id="email"
                          ref={userRef}
                          autoComplete="off"
                          onChange={(e) => setEmail(e.target.value)}
                          value={email}
                          required
                          className="form-control"
                          aria-invalid={validEmail ? "false" : "true"}
                          aria-describedby="uidnote"
                          onFocus={() => setemailFocus(true)}
                          onBlur={() => setemailFocus(false)} />
                        <p id="uidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                          <FontAwesomeIcon icon={faInfoCircle} />
                          Enter Valid Email<br />
                        </p>
                      </div>
                      <div className="sty">
                        <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                      </div>
                    </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input placeholder="Password"
                            type="Password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={password}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)} className="form-control" />
                          <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                          </p>
                        </div>
                        <div className="sty">
                          <FontAwesomeIcon icon={faTimes} className={validPwd || !password ? "hide" : "invalid"} />
                          < FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                        </div>
                      </div>


                      <label for="show" className="show-btn">Forgot Password?</label>

                      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button disabled={!validEmail || !validPwd ? true : false} className="btn btn-primary btn-lg">Login</button>
                      </div>
                      {/* <div className="parent"> */}
                       
                        {/* GOOGLELOGIN---------------------------------START */}
                        <div className="login">
                          {/* <div  className="center">
  <input type="checkbox" id="show"/>
  <label for="show" class="show-btn"> */}
                          {showloginButton ?
                            <GoogleOAuthProvider clientId="373411090368-u976fdji2obn7h8f6m36q9lmq92sdfd0.apps.googleusercontent.com">
                              <GoogleLogin
                                onSuccess={onLoginSuccess}
                                onError={onLoginFailure}
                              />
                            </GoogleOAuthProvider> : null}
                          {/* </label> */}
                          {showlogoutButton ?
                            <button onClick={logout}>Logout</button> : null
                          }

                     
                          {/* </div> */}
                        </div>
                        {/* GOOGLELOGIN------------------END */}
                      {/* </div> */}
                    </form>
                    <p className="text-center text-muted mt-5 mb-0">Don't Have an account? <a href="#!"
                      className="fw-bold text-body" onClick={() => navigate("/")}><u>Signup here</u></a></p>


                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />




                  </div>
                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">

                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                      className="img-fluid" alt="Sample image" />

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* forgotpassword */}


      <div className="center">
        <input type="checkbox" id="show" />
        <div className="forgotcontainer">
          <label for="show" className="close-btn fas fa-times" title="close" onClick={() => resetAll()}></label>

          {!resetPass ? (
            <div>
              {!otpModel ? (
                <div>

                  <div className="text">
                    EMAIL
                  </div>
                  <form action="#" className="mx-1 mx-md-4 mt-5">


                    <div className="d-flex flex-row align-items-center mb-4">
                      <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                      <div className="form-outline flex-fill mb-0">
                        <input placeholder="Email"
                          type="text"
                          id="email"
                          ref={userRef}
                          autoComplete="off"
                          onChange={(e) => setEmail(e.target.value)}
                          value={email}
                          required
                          className="form-control"
                          aria-invalid={validEmail ? "false" : "true"}
                          aria-describedby="uidnote"
                          onFocus={() => setemailFocus(true)}
                          onBlur={() => setemailFocus(false)} />
                        <p id="uidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                          <FontAwesomeIcon icon={faInfoCircle} />
                          Enter Valid Email<br />
                        </p>
                      </div>
                      <div className="sty">
                        <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                      </div>
                    </div>

                    <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4" onClick={() => checkemail()}>
                      <button disabled={!validEmail ? true : false} className="btn btn-primary btn-lg" >Send OTP</button>
                    </div>

                  </form>
                </div>
              ) : (

                <div>
                  <div className="text">
                    OTP VERIFICATION
                  </div>
                  <form action="#" className="mx-1 mx-md-4 mt-5">

                    <div className="d-flex flex-row align-items-center mb-4">
                      <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                      <div className="form-outline flex-fill mb-0">
                        <input placeholder="OTP"
                          type="text"
                          id="otp"
                          ref={userRef}
                          autoComplete="off"
                          onChange={(e) => setOtp(e.target.value)}
                          value={otp}
                          required
                          className="form-control"

                          onFocus={() => setemailFocus(true)}
                          onBlur={() => setemailFocus(false)} />





                      </div>

                    </div>

                    <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4" onClick={() => verifyOtp()}>
                      <button disabled={!otp ? true : false} className="btn btn-primary btn-lg" >Verify OTP</button>
                    </div>

                  </form>
                </div>
              )}
            </div>

          ) : (
            <div>

              <div className="text">
                RESET PASSWORD
              </div>
              <form action="#" className="mx-1 mx-md-4 mt-5">

                <div className="d-flex flex-row align-items-center mb-4">
                  <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                  <div className="form-outline flex-fill mb-0">
                    <input placeholder="NewPassword"
                      type="password"
                      id="newpassword"
                      onChange={(e) => setnewPwd(e.target.value)}
                      value={newpassword}
                      required
                      aria-invalid={validnewPwd ? "false" : "true"}
                      aria-describedby="pwdnote"
                      onFocus={() => setnewPwdFocus(true)}
                      onBlur={() => setnewPwdFocus(false)}
                      className="form-control" />
                    < FontAwesomeIcon icon={faCheck} className={validnewPwd ? "valid" : "hide"} />
                    <FontAwesomeIcon icon={faTimes} className={validnewPwd || !password ? "hide" : "invalid"} />
                    <p id="pwdnote" className={newpwdFocus && !validnewPwd ? "instructions" : "offscreen"}>
                      <FontAwesomeIcon icon={faInfoCircle} />
                      8 to 24 characters.<br />
                      Must include uppercase and lowercase letters, a number and a special character.<br />
                      Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                    </p>
                  </div>
                </div>


                <div className="d-flex flex-row align-items-center mb-4">
                  <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                  <div className="form-outline flex-fill mb-0">
                    <input placeholder="Confirm Password"
                      type="password"
                      id="confirm_pwd"
                      onChange={(e) => setMatchPwd(e.target.value)}
                      value={matchPwd}
                      required
                      aria-invalid={validMatch ? "false" : "true"}
                      aria-describedby="confirmnote"
                      onFocus={() => setMatchFocus(true)}
                      onBlur={() => setMatchFocus(false)}
                      className="form-control" />
                    <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                    <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                    <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                      <FontAwesomeIcon icon={faInfoCircle} />
                      Must match the first password input field.
                    </p>
                  </div>
                </div>

                <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4" onClick={() => resetpassword()}>
                  <button disabled={!validEmail ? true : false} className="btn btn-primary btn-lg" >RESET</button>
                </div>

              </form>
            </div>
          )}


        </div>
      </div>





    </section>
  )
}
export default Login