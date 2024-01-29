import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password,setPassword] =useState("");
    const [auth,setAuth] = useAuth();

    const navigate = useNavigate(); // using hook with constant  )

    const handleSubmit= async(e)=>{
        e.preventDefault()
        // console.log(name,email);// This coming from above state.
        try{
        console.log(process.env.REACT_APP_API);
        const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/login`,
        {email,password});
        
        if (res && res.data.success){
            toast.success(res.data.message);
            setAuth({
                ...auth,user:res.data.user, 
                token: res.data.token,
                // user will updata the data and ...auth will keep the previous properties.
            });     
            localStorage.setItem("auth",JSON.stringify(res.data))
            
            navigate('/');
        } else {
            toast.error(res.data.message);
        }
        }
        catch(error){
            console.log(error);
            toast.error("something went wrong");
        }
    }
    
  return (
    <Layout tittle="Register -Ecommerce App">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
       
        <div className="form-group">
            <input type="email" onChange={(e)=> setEmail(e.target.value)} value ={email} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Your Email" required />
        </div>

        <div className="form-group">
            <input type="password" onChange={(e)=> setPassword(e.target.value)} value={password} className="form-control" id="exampleInputPassword1" placeholder="Enter Your Password" />
        </div>       

        <button type="submit" className="btn btn-primary">Login</button>
        </form>
    </Layout>
  )
}

export default Login
