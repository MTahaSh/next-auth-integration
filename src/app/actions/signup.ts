"use server"
import { sql } from "@vercel/postgres";
import * as schema from "../../../db/schema";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { v4 as uuidv4 } from 'uuid';
import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";
import { createUser } from "../../../db/queries";
import { generateVerificationToken } from "../data/tokens";
import { sendVerificationEmail } from "../data/mail";


const db = drizzle(sql, { schema });


export async function SignupFn(email:string, username:string, password:string){
    try {

        
      
        // //check if user already exists
        const checkUser = await db.query.userTable.findFirst({
          where: eq(schema.userTable.email, email),
        });
      
        if (checkUser) {
          return { error: "User already exists" };
        }
      
        //hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
      
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpReg = Math.floor(100000 + Math.random() * 900000);
        const hashedForgotPassword = await bcryptjs.hash(otp.toString(), salt);
        const hashedRegistrationCode = await bcryptjs.hash(otpReg.toString(), salt);
        // unique userId Generation 
        const id = uuidv4(); 
      
        // try {
      
      
       const user = await createUser({
          id,
          email: email,
          username: username,
          password: hashedPassword,
        })
      
        if(!user) 
          {
            return;
          }
      
      
          const verificationToken = await generateVerificationToken(email);
          console.log("Verification Token: ", verificationToken);
          
          await sendVerificationEmail(verificationToken[0].email ?? "",verificationToken[0].token ?? "");
          
      
          return {success:"User Registered"};
       
        }catch(error:any)
        {
            return (error);
        }


}