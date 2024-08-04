"use client"
import { useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect } from 'react'
import { BeatLoader } from 'react-spinners';
import { useState } from 'react';
import { newVerification } from '../data/new-verification';
import { newVerificationFn } from '../actions/new-verification';

const NewVerification = () => {
    const params = useSearchParams();
    const token = params.get("token");
    const [error,setError] = useState<string | undefined>();
    const [success,setSuccess] = useState<string | undefined>();

    const onSubmit = useCallback(async()=> {
        // console.log(token);

        if(success || error) return;

        if(!token)
            {
                setError("Missing Token!")
            }


            // const res = await fetch("/api/new-verification", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({
            //         token
            //     }),
            // })

            newVerificationFn(token ?? "").then((data)=>{
                setSuccess(data.success);
                setError(data.error);
            }).catch(()=>{
                setError("Something went Wrong!")
            })

            // const data = await res.json();

            // if(!res.ok)
            //     {
            //         alert("Error in Email verification");
            //         return;
            //     }

            //     if(data.success)
            //         {
            //             setSuccess(data.success);
            //             return;
            //         }
            //         else if(data.error)

            //             {
            //                 setError(data.error);
            //                 return;
            //             }
        
            // newVerification(token ?? "")
            // .then((data)=>{
            //     setSuccess(data.success);
            //     setError(data.error);
            // })
            // .catch(()=>{
            //     setError("Something went Wrong!")
            // })



    },[token, success, error]);

    useEffect(() => {
      onSubmit();
    }, [onSubmit])
    


  return (
    <div className='flex w-full h-screen justify-center items-center'>
        <div className='flex justify-center flex-col space-y-8 text-black items-center rounded-xl w-1/2 h-[500px] bg-white '>
        <h1 className='text-3xl font-bold'>Authentication</h1>
        <p>Confirming your verification</p>

        {!success && !error && (
            <BeatLoader />
        )
        }

        <p>{success}</p>
        <p>{error}</p>

        </div>
    </div>
  )
}

export default NewVerification