import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Signup.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Swal from 'sweetalert2'


const USER_REGEX = /^[a-zA-Z]{3,24}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const MOBILENO_REGEX = /^(\+\d{1,3}[- ]?)?\d{10}$/;

const Signup = () => {
  const navigate = useNavigate();
  const userRef = useRef();
  const errRef = useRef();

  const [userName, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [password, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setemailFocus] = useState(false);

  const [mobileNumber, setmobileNumber] = useState('');
  const [validmobileNumber, setValidmobileNumber] = useState(false);
  const [mobileNumberFocus, setmobileNumberFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  //   const [success, setSuccess] = useState(false);

  // useEffect(() => {
  //   userRef.current.focus();
  // }, [])

  useEffect(() => {

    setErrMsg('');
    setValidName(USER_REGEX.test(userName));
    setValidPwd(PWD_REGEX.test(password));
    setValidEmail(EMAIL_REGEX.test(email));
    setValidmobileNumber(MOBILENO_REGEX.test(mobileNumber));
  }, [userName, password, mobileNumber, email])

  const handleSubmit = async (e) => {
    console.log(e)
    e.preventDefault();
    const v1 = USER_REGEX.test(userName);
    const v2 = PWD_REGEX.test(password);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post('http://192.168.1.4:7000/api/v1/user/signupPage', { userName, email, password, mobileNumber, logintype: "default" })
      console.log(response)
      if(response){
        setUser('');
      setPwd('');
      setEmail('');
      setmobileNumber('');
        Swal.fire({
          title: 'Account Created Successfully!',
          text: "Login to continue!",
          icon: 'Success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'ok'
        }).then((result) => {
          console.log(result)
          if (result.value) {
            navigate('/login')
          }
        })

      
      }
      

    } catch (err) {
      console.log(err)
      errRef.current.focus();
    }
  }

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

                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>

                    <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>

                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">

                          <input placeholder="UserName"
                            type="text"
                            id="userName"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={userName}
                            required
                            className="form-control"
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)} />



                          <p id="uidnote" className={userFocus && userName && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            3 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens not allowed.
                          </p>

                        </div>
                        <div className="marker">
                          <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                          <FontAwesomeIcon icon={faTimes} className={validName || !userName ? "hide" : "invalid"} />
                        </div>
                      </div>

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
                        <div className="marker">
                          <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                          <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                        </div>
                      </div>

                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input type="text"
                            placeholder="MobileNumber"
                            id="mobilenumber"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setmobileNumber(e.target.value)}
                            value={mobileNumber}
                            required
                            aria-invalid={validmobileNumber ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setmobileNumberFocus(true)}
                            onBlur={() => setmobileNumberFocus(false)}
                            className="form-control" />

                          <p id="uidnote" className={mobileNumberFocus && mobileNumber && !validmobileNumber ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Enter valid MobileNumber,<br />
                            MobileNumber must be 10 digit<br />

                          </p>
                        </div>
                        <div className="marker">
                          <FontAwesomeIcon icon={faCheck} className={validmobileNumber ? "valid" : "hide"} />
                          <FontAwesomeIcon icon={faTimes} className={validmobileNumber || !mobileNumber ? "hide" : "invalid"} />
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
                          < FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                          <FontAwesomeIcon icon={faTimes} className={validPwd || !password ? "hide" : "invalid"} />
                        </div>
                      </div>




                      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button disabled={!validName || !validPwd || !validEmail || !validmobileNumber ? true : false} className="btn btn-primary btn-lg">Sign-Up</button>
                      </div>

                    </form>
                    <p className="text-center text-muted mt-5 mb-0"> <a href="#!"
                      className="fw-bold text-body" onClick={() => navigate("/login")}><u>Log in to Existing Account</u></a></p>
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

    </section>
  )
}
export default Signup