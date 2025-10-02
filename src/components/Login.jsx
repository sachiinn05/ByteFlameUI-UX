import axios from 'axios';
import  { useState } from 'react'
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

const Login = () => {
const [emailId, setEmailId]=useState("sachin@gmail.com");
const [password,setPassword]=useState("Sachin@123");
const dispatch=useDispatch()
const navigate =useNavigate();
const handleLogin=async () => {
    try{
    const res=await axios.post(BASE_URL+"/login",{
        emailId,
        password,
    },
   {withCredentials:true}
)
dispatch(addUser(res.data))
return navigate("/")
}catch(err)
{
    console.error(err);
}
    
 };

  return (
    <div className='flex justify-center my-50'>
    <fieldset className="fieldset bg-white/90 border border-gray-200 rounded-2xl shadow-2xl w-[350px] p-6 backdrop-blur">
    <legend className="fieldset-legend text-2xl font-bold text-center text-gray-800 mb-6">
      Login
    </legend>

    <label className="label font-medium text-gray-700">Email</label>
    <input type="email" 
     value={emailId}
    className="input input-bordered w-full focus:ring-2 focus:ring-blue-500" placeholder="Enter your email" 
     onChange={(e)=>setEmailId(e.target.value)}
    />

    <label className="label font-medium text-gray-700 mt-3">Password</label>
    <input type="password" 
     value={password}
    className="input input-bordered w-full focus:ring-2 focus:ring-pink-500" placeholder="Enter your password" 
    onChange={(e)=>setPassword(e.target.value)}/>

    <button className="btn w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-purple-500 hover:to-pink-500 shadow-md" 
      onClick={handleLogin}>
      Login
    </button>

    <p className="text-center text-sm text-gray-600 mt-4">
      Don’t have an account? <a href="#" className="text-blue-600 hover:underline">Sign up</a>
    </p>
  </fieldset>
</div>
  )
}

export default Login