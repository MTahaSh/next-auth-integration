"use server"
import { getUserByEmail } from "../../../db/queries";
import { generatePasswordResetToken } from "../data/tokens";
import { getResetTokenByEmail, getResetTokenByToken } from "../data/verification-token";
import { sendResetPasswordEmail } from "../data/mail";


export async function PasswordReset(email:string){

    try {
    
        console.log("Email in route: ", email);
        
        const user = await getUserByEmail(email);
        if(!user[0])
            {
                return {error:"Invalid email"};
            }
    
            await generatePasswordResetToken(email);
            
           const token =  await getResetTokenByEmail(email);
    
           if(token)
           {
               await sendResetPasswordEmail(email,token[0]?.token ?? "");
               return {success:"Email Sent"};
           }
    

        
    } catch (error) {
        return {error:"Error Sending Email"};
    }





}