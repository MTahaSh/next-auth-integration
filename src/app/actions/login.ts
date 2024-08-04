"use server"
import { TwoFactorConfirmationTable, userTable } from "../../../db/schema";
import { db } from "../../../db/schema";
import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";
import { generateVerificationToken, generateTwoFactorToken } from "../data/tokens";
import { sendVerificationEmail, sendTwoFactorEmail } from "../data/mail";
import { signIn } from "next-auth/react";
import { twoFactorConfirmationById } from "../data/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "../data/verification-token";
import { twoFactorTable } from "../../../db/schema";


export async function login(email:string, password:string, code:string)
{
    try {
        // const req = await request.json();
        // const { email, password } = req;
    
        
        console.log("email in route: ", email);
        
        const user = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1);
        console.log("user in route: ", user[0]);
        
      
        if (!user[0]) {
          console.error("Login User does not exist");
          return { success: "User does not exist" };
        }
    
        if (!user[0]?.password) {
          console.error("User logged in via Google/Github. Cannot login with email/password.");
          return { error: "User logged in via provider" };
        }
      
          const validPassword = await bcryptjs.compare(password, user[0]?.password);
      
          if (!validPassword) {
            console.error("Invalid Password");
            // alert("Invalid Password")
         return {success:"Invalid Password"};
    
          }
      
          if(!user[0]?.email_verified) {
            const verificationToken = await generateVerificationToken(user[0]?.email ?? "");
            await sendVerificationEmail(verificationToken[0].email ?? "", verificationToken[0].token ?? "");
            console.log("Confirmation Email Sent!");
            
            // alert("Confirmation Email Sent!")
            return {success:"Confirmation Email sent"};
          }


          if(user[0]?.isTwoFactorEnabled && user[0]?.email)
          {
            if(code)
            {

              const twoFactorToken = await getTwoFactorTokenByEmail(user[0]?.email ?? "");
              if(!twoFactorToken)
              {
                return {error:"Invalid code"}
              }

              if(twoFactorToken[0]?.token !== code)
              {
                return {error:"Invalid code"}
              }

              const hasExpired = new Date(twoFactorToken[0]?.token) < new Date();

              if(hasExpired)
              {
                return {error: "Code expired"}
              }

              await db.delete(twoFactorTable).where(eq(twoFactorTable.id, twoFactorToken[0]?.id));

              const existingConfirmation = await twoFactorConfirmationById(twoFactorToken[0]?.id ?? "");

              if(existingConfirmation)
              {
                await db.delete(TwoFactorConfirmationTable).where(eq(TwoFactorConfirmationTable.id, existingConfirmation[0]?.id));
              }

              await db.insert(TwoFactorConfirmationTable).values({
                id: twoFactorToken[0]?.id,
              })

            }
            
            else {


            const twoFactorToken = await generateTwoFactorToken(user[0]?.email ?? "");
            await sendTwoFactorEmail(
              twoFactorToken[0]?.email ?? "",
              twoFactorToken[0]?.token ?? "",
            );


            return {twoFactor: true, success:"2FA code sent"};
          }

          }

          

        
            return {success:"Login Success", error:"Something went wrong"};
    
}
catch(error:any)
{
    return {error: error}
}
}