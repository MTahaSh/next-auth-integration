"use server"
import { newPassword } from "../data/new-verification";
import { NextResponse } from "next/server";

export async function NewPasswordReset(token:string, password:string)
{
    try {
        const res = await newPassword(token ?? "",password);
        return {success:res.success, error:res.error};
        
    } catch (error) {
        console.log("Error: ", error);
        
    }
}