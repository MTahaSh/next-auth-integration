import { NextResponse } from "next/server";
import bcryptjs, { compare } from "bcryptjs";
import * as schema from "../../../../db/schema";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { generateVerificationToken } from "@/app/data/tokens";
import { getUserByEmail } from "../../../../db/queries";
import { signIn } from 'next-auth/react';
import { userTable } from "../../../../db/schema";
import { db } from "../../../../db/schema";
import { sendVerificationEmail } from "@/app/data/mail";
// const db = drizzle(sql, { schema });

export async function POST(request: Request) {
  try {
    const req = await request.json();
    const { email, password } = req;

    
    console.log("email in route: ", email);
    
    const user = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1);
    console.log("user in route: ", user[0]);
    
  
    if (!user[0]) {
      console.error("Login User does not exist");
      return NextResponse.json({ success: "User does not exist" }, { status: 404 });
    }

    if (!user[0]?.password) {
      console.error("User logged in via Google/Github. Cannot login with email/password.");
      return NextResponse.json({ error: "User logged in via provider" }, { status: 400 });
    }
  
      const validPassword = await bcryptjs.compare(password, user[0]?.password);
  
      if (!validPassword) {
        console.error("Invalid Password");
        // alert("Invalid Password")
     return NextResponse.json({success:"Invalid Password"});

      }
  
      if(!user[0]?.email_verified) {
        const verificationToken = await generateVerificationToken(user[0]?.email ?? "");
        await sendVerificationEmail(verificationToken[0].email ?? "", verificationToken[0].token ?? "");
        console.log("Confirmation Email Sent!");
        
        // alert("Confirmation Email Sent!")
        return NextResponse.json({success:"Confirmation Email sent"});
      }

        return NextResponse.json({success:"Login Success"});

  } catch (error: any) {
   return NextResponse.json({ error: error.message }, { status: 500 });
  }
   //   NextResponse.json({ error: error.message }, { status: 500 });
  }
