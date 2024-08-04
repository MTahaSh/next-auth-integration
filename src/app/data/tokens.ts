import {v4 as uuid} from 'uuid';
import { getVerificationTokenByEmail } from './verification-token';
import { passwordResetTable, twoFactorTable, verificationTable } from '../../../db/schema';
import { db } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { signIn } from 'next-auth/react';
import { getResetTokenByEmail } from './verification-token';
import crypto from "crypto"
import { getTwoFactorTokenByEmail } from './verification-token';

export const generateTwoFactorToken = async(email:string)=>{
    const token = crypto.randomInt(100_000,1_000_000).toString();
    const existingToken = await getTwoFactorTokenByEmail(email);
    const expires = new Date(new Date().getTime() + 3600 * 1000).toISOString();
    const id = uuid();


    if(existingToken)
    {
        await db.delete(twoFactorTable).where(eq(twoFactorTable.id,existingToken[0]?.id))
    }

    const twoFactorToken = await db.insert(twoFactorTable).values({
        id: id,
        email: email,
        token: token,
        expires: expires,
    }).returning();


    return twoFactorToken;


}

export const generatePasswordResetToken = async(email:string)=>{
    const token = uuid();
    const id = uuid();

    const expires = new Date(new Date().getTime() + 3600 * 1000).toISOString();
    
    const existingToken = await getResetTokenByEmail(email);
    if(existingToken)
    {
        await db.delete(passwordResetTable).where(eq(passwordResetTable.id, existingToken[0]?.id));
    }

    const resetToken = await db.insert(passwordResetTable).values({
    id,
    email,
    token,
    expires
    }).returning();

    return resetToken;



    // const existingToken = getResetTokenByEmail();
}


export const generateVerificationToken = async(email:string) => {
    const token = uuid();
    const id = uuid();
    const expires = new Date(new Date().getTime() + 3600 * 1000).toISOString();

    const existingToken = await getVerificationTokenByEmail(email);

    if(existingToken){
        await db.delete(verificationTable).where(eq(verificationTable.id, existingToken[0]?.id));
    }


    // console.log("Id in token: ", id);
    
    const verificationToken = await db.insert(verificationTable).values({
        id,
        email,
        token,
        expires
    }).returning();

    return verificationToken;


}


export const signInCred = async(email:string, password:string) => {
   
   const res = await signIn("credentials", {
        email: email,
        password: password,
        redirect: true,
        callbackUrl: "http://localhost:3000"
    })

    if(res?.error){
    alert("Error signing in!")
    return;
    }

    return {success: "Logged In"}


}