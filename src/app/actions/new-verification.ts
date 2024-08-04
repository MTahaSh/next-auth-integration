"use server"
import { newVerification } from "../data/new-verification";

export async function newVerificationFn(token:string)
{
    const res = await newVerification(token);
    console.log("Response: ", res);
    
    return ({success:res.success, error:res.error});
}