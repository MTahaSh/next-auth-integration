import { NextResponse, NextRequest } from "next/server";
import { getVerificationTokenByEmail } from "@/app/data/verification-token";
import { getUserByEmail } from "../../../../db/queries";
import { newVerification } from "@/app/data/new-verification";

export async function POST(request: NextRequest) {
const req = await request.json();
const {token} = req;

try {
    const res = await newVerification(token);
    console.log("Response: ", res);
    
    return NextResponse.json({success:res.success, error:res.error});
} catch (error) {
    return NextResponse.json({error:"Error Verifying Email"});
}




}