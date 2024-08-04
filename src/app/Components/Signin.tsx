"use client"
import { signIn } from 'next-auth/react';
import React, { useRef, useState } from 'react'
import bcryptjs, { compare } from "bcryptjs";
import * as schema from "../../../db/schema";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { generateVerificationToken } from "@/app/data/tokens";
import { db } from '../../../db/schema';
import { userTable } from '../../../db/schema';
import Link from 'next/link';
import { login } from '../actions/login';


const Signin = () => {

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const email = useRef("");
  const password = useRef("");
  const code = useRef("");
  // const db = drizzle(sql, { schema });


  const onSubmit = async () => {


    // const user = await db.query.userTable.findFirst({
    //   where: eq(schema.userTable.email,email.current),
    // });


    try {
      console.log("Email: ", email.current);
      console.log("Password: ", password.current);



      login(email.current, password.current, code.current)
        .then(async (data) => {
          // alert(data?.success)
          const res = await signIn("credentials", {
            email: email.current,
            password: password.current,
            redirect: false,
            callbackUrl: "http://localhost:3000"
          })

          // console.log("Response from SignIn: ", res);


          if (!res?.ok) {
            alert("Something went wrong");
            return;
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }


          alert(data?.success)
          // alert(data?.error)

        }).catch((error) => {
          alert(error);
          return;
        })





      // alert("Logged in")

      // try {

      //   const res = await fetch("/api/login", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       email: email.current,
      //       password: password.current
      //     }),
      //   })

      //   const data = await res.json();

      //   if(!res.ok)
      //     {
      //       alert("Error in Submission");
      //       return;
      //     }
      //     console.log("Data Response: ", data);
      //     console.log("Data Response in success: ", data.success);


      //     if(data.success === "Confirmation Email sent" || data.success === "Invalid Password" || data.success === "User does not exist")
      //       {
      //         alert(`${data.success}`)
      //         return;
      //       }


      //     await signIn("credentials", {
      //       email: email.current,
      //       password: password.current,
      //       redirect: false,
      //       callbackUrl: "http://localhost:3000"
      //   })  

      // alert("Logged in");


      // } catch (error) {
      //   console.log("Error in Sign in: ", error);

      // }



    } catch (error) {
      alert("Something went wrong")
    }


  }
  return (
    <div>
      <div className='flex flex-col space-y-8 justify-center items-center h-screen' >

        {showTwoFactor && (
          <>
            <div className='flex flex-col'>
              <label>Code</label>
              <input className='text-black' type="text" onChange={(e) => code.current = e.target.value} />
            </div>
          </>
        )}


        {!showTwoFactor &&
          (
            <>
              <div className='flex flex-col'>
                <label>Email</label>
                <input className='text-black' type="text" onChange={(e) => email.current = e.target.value} />
              </div>


              <div className='flex flex-col'>
                <label>Password</label>
                <input className='text-black' type="password" onChange={(e) => password.current = e.target.value} />
              </div>


              <div className="flex justify-center text-white items-center flex-col space-y-3 ">
                <Link href="/reset" >Forgot Password?</Link>
              </div>
            </>)
        }

        <div className='flex flex-col items-center justify-center space-y-4'>
          <button className='px-8 hover:bg-green-600/80 py-3 rounded-lg bg-green-600' onClick={onSubmit}>{showTwoFactor? "Confirm" : "Sign In"}</button>
          <button className='px-8 py-3 hover:bg-white/80 rounded-lg bg-white text-black' onClick={() => signIn("google")}>Google</button>
          <button className='px-8 py-3 hover:text-blue-600 hover:border-blue-600 rounded-lg border-white border-[1px] bg-black text-white' onClick={() => signIn("github")}>Github</button>
          <button className='px-8 py-3 hover:bg-blue-600/80 rounded-lg bg-blue-600' onClick={() => signIn("linkedin")}>Linkedin</button>
        </div>

      </div>
    </div>
  )

}

export default Signin