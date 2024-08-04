"use client"
import { signIn } from 'next-auth/react';
import React, { useRef } from 'react'
import { SignupFn } from '../actions/signup';

const Signup = () => {

    const username = useRef("");
    const password = useRef("");
    const email = useRef("");

    const onSubmit = async () => {
        // e.preventDefault();
        // await signIn("credentials", {
        //     username: username.current,
        //     password: password.current,
        //     redirect: false,
        //     callbackUrl: "http://localhost:3000"
        // })

        console.log("username: " + username.current);
        console.log("password: " + password.current);

        
        SignupFn(email.current, username.current, password.current)
        .then((data)=>{
            alert("Success in Submission");
        })
        .catch((error)=>{
            alert("Error in submission");
        })
        // const res = await fetch(process.env.NEXT_PUBLIC_Backend_URL + "/api/signup", {
        //     method: "POST",
        //     body: JSON.stringify({
        //         email: email.current,
        //         username: username.current,
        //         password: password.current
        //     }),
        //     headers: {
        //         "Content-Type": "application/json",
        //     },

            
        // })

        // if(!res.ok)
        //     {   
        //     console.log("Error in submission");
        //     return;    
        //     }

        //     console.log("Success in submission");
            

    }
  return (
    <div>
        <div  className='flex flex-col space-y-8 justify-center items-center h-screen' >
        


        <div className='flex flex-col'>
        <label>Email</label>
        <input className='text-black' type="email"  onChange={(e)=>email.current = e.target.value}/>
        </div>


        <div className='flex flex-col'>
        <label>username</label>
        <input className='text-black'  type="text" onChange={(e)=>username.current = e.target.value}/>
        </div>
        
        
        <div className='flex flex-col'>
        <label>Password</label>
        <input className='text-black' type="password"  onChange={(e)=>password.current = e.target.value}/>
        </div>
        
        <div className='px-8 py-3 bg-green-600'>
        <button onClick={onSubmit}>Submit</button>
        </div>

        </div>
    </div>
  )
}

export default Signup