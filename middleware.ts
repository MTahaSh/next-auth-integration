import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/auth";
import NextAuth from "next-auth/next";

const {auth } = NextAuth(authOptions);


export default auth((req:any)=>
    {
        console.log("Hello");
        
        
    })
export const config = {
//   matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
  matcher: [''],

};
