"use client"
import React from 'react'
import { useRef, useState } from 'react';
import { newPassword } from '../data/new-verification';
import { useSearchParams } from 'next/navigation';
import { NewPasswordReset } from '../actions/new-password';

const NewPassword = () => {
    const [error,setError] = useState<string | undefined>();
    const [success,setSuccess] = useState<string | undefined>();
    const password = useRef("");
    const token = useSearchParams().get("token");
    console.log("Token: ", token);
    

    const onSubmit = async()=>{
        
        setError("");
        setSuccess("");

        console.log("Email in client: ", password.current);
        

    //     const res = await fetch("/api/reset", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //             password: password.current,
    //     })
    // })

    // try {
    //     const res = await newPassword(token ?? "",password.current);
    //     if(!res)
    //     {
    //         setError("Something went wrong!");
    //         return;
    //     }

    //     setSuccess("Password Changed Successfully");
    //     console.log("Response: ", res);
        
    // } catch (error) {
    //     console.log("Error: ", error);
        
    // }

    NewPasswordReset(token ?? "", password.current)
            .then((data)=>{
                setSuccess(data?.success);
                setError(data?.error);
            })
            .catch(()=>{
                setError("Something went Wrong!")
            })


        // const res = await NewPasswordReset(token ?? "", password.current);

        // const data = await res?.json();
        // if(data?.success || data?.error)
        //     {
        //         setError(data.error);
        //         setSuccess(data.success);
        //         return;
        //     }

}
    

  return (
    <div className='flex justify-center items-center w-full h-screen text-black'>

    <div className='flex bg-white w-1/2 h-[500px] rounded-3xl justify-center items-center space-y-8 px-4 flex-col'>
    <h1 className='font-bold text-3xl'>Enter new Password</h1>

    <div className='flex flex-col text-black space-y-4'>
        <span>Password</span>
        <input className='border-[1.5px] border-black' onChange={(e)=>password.current = e.target.value} type="password" name="" id="" />
        <button onClick={onSubmit} className='px-6 py-4 bg-black  text-white rounded-xl'>Reset Password</button>
        <p className='text-green-400'>{success}</p>
        <p className='text-red-400'>{error}</p>
    </div>

    </div>

    </div>
  )
}

export default NewPassword