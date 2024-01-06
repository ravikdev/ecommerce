import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address,setAddress] = useState("");
    const [phone,setPhone]= useState("");
    const [password,setPassword] =useState("");

    const navigate = useNavigate(); // using hook with constant


    const handleChange =(event)=>{
        // const name = event.target.name;
        // const value = event.target.value;
        // setName(values => ({...values, [name]: value}))
    }
    const handleSubmit= async(e)=>{
        e.preventDefault()
        // console.log(name,email);// This coming from above state.
        try{
            console.log(process.env.REACT_APP_API);
        const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/register`,
        {name,email,phone,password,address});

        if (res && res.data.success){
            toast.success(res.data.message);
            navigate('/login');
        } else {
            toast.error(res.data.message);
        }
        }

        catch(error){
            console.log(error);
            toast.error("something went wrong");
        }

    }
    console.log(process.env.REACT_APP_API);

    return (
    <Layout tittle="Register -Ecommerce App">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
        <div className="form-group">
            <input type="text" onChange={(e)=> setName(e.target.value)} value ={name} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Your Name" required/>
        {/* Changes will be detact by event */}
        </div>  
        <div className="form-group">
            <input type="email" onChange={(e)=> setEmail(e.target.value)} value ={email} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Your Email" required />
        </div>
        <div className="form-group">
            <input type="text" onChange={(e)=> setPhone(e.target.value)} value = {phone} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Your Phone Number" required />
        </div>
        <div className="form-group">
            <input type="text" onChange={(e)=> setAddress(e.target.value)} value={address} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Your Address" required />
        </div>
        <div className="form-group">
            <input type="password" onChange={(e)=> setPassword(e.target.value)} value={password} className="form-control" id="exampleInputPassword1" placeholder="Enter Your Password" />
        </div>       

        <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    </Layout>
  )
}

export default Register

