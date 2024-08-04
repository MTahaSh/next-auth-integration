"use client"
import Image from "next/image";
import {signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function Home() {
  const router = useRouter();
  return (
    <main className="">
      <div className="flex items-center space-y-8 h-screen justify-center flex-col">
        <h1>Welcome to the authentication integration</h1>

        <div className="flex flex-row space-x-8">

        <div className="flex justify-center items-center flex-col space-y-3  ">
          <span>SignUp</span>
          <button onClick={()=>router.push("/signup")} className="bg-blue-500 px-8 py-4 ">Sign Up</button>
        </div>

        <div className="flex justify-center items-center flex-col space-y-3 ">
          <span>SignIn</span>
          <button onClick={()=>router.push("/login")} className="bg-blue-500 px-8 py-4 ">Sign In</button>
        </div>

        <div className="flex justify-center items-center flex-col space-y-3 ">
          <span>Sign Out</span>
          <button onClick={()=>signOut()} className="bg-blue-500 px-8 py-4 ">Sign Out</button>
        </div>

        </div>

      </div>
    </main>
  );
}
