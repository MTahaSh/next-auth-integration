import React from "react";
import { getResetTokenByToken, getVerificationTokenByToken } from "./verification-token";
import { getUserByEmail } from "../../../db/queries";
import { db, verificationTable } from "../../../db/schema";
import { userTable } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { DevBundlerService } from "next/dist/server/lib/dev-bundler-service";
import bcryptjs from "bcryptjs";
import { passwordResetTable } from "../../../db/schema";

export const newPassword = async(token:string, password:string) => {
    const existingToken = await getResetTokenByToken(token);
    if(!existingToken){
        return {error: "Token does not exist"}
    }

    const hasExpired = new Date(existingToken[0]?.expires ?? "") < new Date();

    if(hasExpired){
        return {error:"Token has expired"}
    }

    const existingUser = await getUserByEmail(existingToken[0]?.email ?? "");
    if(!existingUser){
        return {error: "User does not exist!"}
    }

    //hash password
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

    await db.update(userTable).set({password: hashedPassword}).where(eq(userTable?.id, existingUser[0]?.id));
    await db.delete(passwordResetTable).where(eq(passwordResetTable.id, existingToken[0]?.id));

    return {success: "Password Reset"}
}


export const newVerification = async(token:string) => {
    console.log("Token Passed: ", token);
    
    const existingToken = await getVerificationTokenByToken(token);

    console.log("Existing Token: ", existingToken);
    

    if(!existingToken)
        {
            return {error: "Token does not exist"}
        }

        const hasExpired = new Date(existingToken.expires ?? "") < new Date();
        console.log("Validation: ", hasExpired);
        

        if(hasExpired)
            {
                return {error:"Token has expired"}
            }

        const existingUser = await getUserByEmail(existingToken.email ?? "");

        if(!existingUser)
            {
                return {error: "User does not exist!"}
            }

        await db.update(userTable).set({email_verified: new Date().toISOString(), email: existingToken.email}).where(eq(userTable?.id, existingUser[0]?.id));

        await db.delete(verificationTable).where(eq(verificationTable.id, existingToken.id));

        return {success: "Email Verified"}

}