import React, { useState } from 'react';
import './Login.css';
import RightSideBanner from './RightSideBanner';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const navigate=useNavigate()

    const [form,setForm]=useState({
        name:'',
        email:'',
        password:'',
        phoneNumber:''
    });

    const handleChange=(e)=>{
        setForm({...form,[e.target.name]:e.target.value})
    }

    const handleSubmit= async (e)=>{
        e.preventDefault();
        try{
            const response=await axios.post('http://localhost:5000/api/v1/users/register',form);
            if(response.status==200){
                console.log("Registration Successful",response);
                localStorage.setItem('authToken',response.data.token)
                navigate('/')
            }else{
                console.log('Registration Failed',response)    
            }
        }catch(error){
            console.log("Registrion Failed ",error)
        }
    }
    return (
        <div className='row vh-100 w-100 m-0'>
            {/* Left Side Of Page */}
            <div className='col-lg-6 col-12 d-flex align-items-center justify-content-center leftside-bg'>
                <div
                    className="w-100"
                    style={{
                        maxWidth: '420px',
                        padding: '2rem',
                    }}

                >
                    <h3 className="fw-bold text-white mb-4">Register</h3>
                    {/* Registration Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label text-light">Name</label>
                            <input
                                type="text"
                                className="form-control bg-dark text-white border-0"
                                id="name"
                                name='name'
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label text-light">Email</label>
                            <input
                                type="email"
                                className="form-control bg-dark text-white border-0"
                                id="email"
                                name='email'
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label text-light">Password</label>
                            <input
                                type="password"
                                className="form-control bg-dark text-white border-0"
                                id="password"
                                name='password'
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="phoneNumber" className="form-label text-light">Phone Number</label>
                            <input
                                type="text"
                                className="form-control bg-dark text-white border-0"
                                id="phoneNumber"
                                name='phoneNumber'
                                value={form.phoneNumber}
                                onChange={handleChange}
                                placeholder="Enter your Phone Number"
                            />
                        </div>

                        <button type="submit" className="btn btn-success w-100 fw-semibold" >
                            Sign up to your account
                        </button>
                    </form>
                    <div className="text-start mt-4">
                        <span className="text-light">
                            Already have an account?{' '}
                            <a href="#" className="text-success text-decoration-none fw-semibold">Sign in</a>
                        </span>
                    </div>
                </div>
            </div>

            {/* Right Side Of Page */}
            <div className='col-lg-6 col-12 align-items-center justify-content-lg-start justify-content-center d-lg-flex d-none rightside-bg p-5'>
                <RightSideBanner />
            </div>
        </div>
    );
}
export default Register;