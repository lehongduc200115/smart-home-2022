import React, {useState, useRef} from 'react'
import { Form, Alert} from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import "./login.css"


export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault()
        // console.log("handleSubmit")
        try {
          setError("")
          setLoading(true)
          await login(emailRef.current.value, passwordRef.current.value)
          navigate('/');
        } catch {
          setError("Failed to log in")
        }
    
        setLoading(false)
    }
  return (
    // <section className="vh-100 gradient-custom">
        // <div className="container py-5 h-100">
            // <div className="row d-flex justify-content-center align-items-center h-100">
            <div>
        <div className="list">
                    <a style={{"float":"left",'marginLeft':"60vw"}} href="homepage"><h1 className="font2 font3">HOME</h1></a>
                    <a style={{"float":"left",'marginLeft':"3vw"}} href="#"><h1 className="font2 font3">ABOUT US</h1></a>
                    <a style={{"float":"left",'marginLeft':"4vw"}} href="#"><h1 className="font2 font3">DASHBOARD</h1></a>
                    <a style={{"float":"left",'marginLeft':"5.5vw"}} href="login"><h1 className="font2 font3">LOGIN</h1></a>
            </div>
                <div className="col-12 col-md-8 col-lg-6 col-xl-6" style={{"marginTop":"10vw"}}>
                <div className=" text-dark">
                    <div className=" p-5 text-center">
        
                    <div className="mb-md-3 mt-md-4">
        
                        <h2 className="fw-bold mb-2 text-uppercase font5">Đăng nhập</h2>
                        <p className="text-dark-50 mb-5">Hãy điền tài khoản và mật khẩu của bạn!</p>
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <div className="form-outline form-white mb-4">
                            <input style={{"width":"30vw","marginLeft":"7vw"}} type="email" className="form-control form-control-lg" ref={emailRef} placeholder="Tài khoản" required />
                            </div>
            
                            <div className="form-outline form-white mb-4">
                            <input style={{"width":"30vw","marginLeft":"7vw"}} type="password" className="form-control form-control-lg" placeholder="Mật khẩu" ref={passwordRef} required />
                            </div>
                            
                            <button disabled={loading} className="btn btn-dark text-white btn-lg px-5" type="submit">Tiếp tục</button>
                        </Form>
                        <p className="small mt-5 "></p>
                    </div>
                    </div>
                </div>
                </div>
            // </div>
        // </div>
    // </section>
  )
}
