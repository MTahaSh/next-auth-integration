"use client"
import React from 'react'
import { useState, useRef } from 'react'
import { PasswordReset } from '../actions/password-reset';

const Reset = () => {
    const [error,setError] = useState<string | undefined>();
    const [success,setSuccess] = useState<string | undefined>();
    const email = useRef("");

    const onSubmit = async()=>{
        setError("");
        setSuccess("");

        console.log("Email in client: ", email.current);
        

    //     const res = await fetch("/api/reset", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //             email: email.current,
    //     })
    // })

    // if(!res.ok)
    //     {
    //         setError("Something went wrong!");
    //         return;
    //     }

    PasswordReset(email.current)
    .then((data)=>{
        setSuccess(data?.success);
        setError(data?.error);
    })
    .catch(()=>{
        
        setError("Something went wrong!");
    })
    
    
        // const data = await res.json();
        // if(data.success || data.error)
        //     {
        //         setError(data.error);
        //         setSuccess(data.success);
        //         return;
        //     }

}
    

  return (
    <div className='flex justify-center items-center w-full h-screen text-black'>

    <div className='flex bg-white w-1/2 h-[500px] rounded-3xl justify-center items-center space-y-8 px-4 flex-col'>
    <h1 className='font-bold text-3xl'>Password Reset</h1>
    <p>Forgot your password?</p>


    <div className='flex flex-col text-black space-y-4'>
        <span>Email</span>
        <input className='border-[1.5px] border-black' onChange={(e)=>email.current = e.target.value} type="email" name="" id="" />
        <button onClick={onSubmit} className='px-6 py-4 bg-black  text-white rounded-xl'>Send Reset Email</button>
        <p className='text-green-400'>{success}</p>
        <p className='text-red-400'>{error}</p>
    </div>

    </div>

    </div>
  )
}

export default Reset