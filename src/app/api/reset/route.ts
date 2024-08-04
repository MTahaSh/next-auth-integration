import { NextResponse, NextRequest } from "next/server";
import { getUserByEmail } from "../../../../db/queries";
import { sendResetPasswordEmail } from "@/app/data/mail";
import { getResetTokenByEmail, getVerificationTokenByEmail } from "@/app/data/verification-token";
import { generatePasswordResetToken } from "@/app/data/tokens";

export async function POST(request: NextRequest) {
const req = await request.json();

try {
    
    const {email} = req;

    
    console.log("Email in route: ", email);
    
    const user = await getUserByEmail(email);
    if(!user[0])
        {
            return NextResponse.json({error:"Invalid email"});
        }

        await generatePasswordResetToken(email);
        
       const token =  await getResetTokenByEmail(email);

       if(token)
       {
           await sendResetPasswordEmail(email,token[0]?.token ?? "");
           return NextResponse.json({success:"Email Sent"});
       }


} catch (error) {
    return NextResponse.json({error:"Error Sending Email"});
}


}