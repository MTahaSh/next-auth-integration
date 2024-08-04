import { NextResponse, NextRequest } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";
import * as schema from "../../../../db/schema";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { createUser } from "../../../../db/queries";
import { generateVerificationToken } from "@/app/data/tokens";
import { getVerificationTokenByEmail } from "@/app/data/verification-token";
import { sendVerificationEmail } from "@/app/data/mail";

const db = drizzle(sql, { schema });


export async function POST(request: NextRequest) {
  try {

  const reqBody = await request.json();
  // await db.insert(userTable).values(reqBody);
  const { username, email, password, role} = reqBody;
  // //console.log(reqBody);

  // //check if user already exists
  const checkUser = await db.query.userTable.findFirst({
    where: eq(schema.userTable.email, reqBody.email),
  });

  if (checkUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
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
    email:reqBody.email,
    username: reqBody.username,
    password: hashedPassword,
  })

  if(!user) 
    {
      return;
    }


    const verificationToken = await generateVerificationToken(reqBody.email);
    console.log("Verification Token: ", verificationToken);
    
    await sendVerificationEmail(verificationToken[0].email ?? "",verificationToken[0].token ?? "");
    
// const verify = await getVerificationTokenByEmail(reqBody.email);


    // await db.insert(schema.userTable).values({
    //   id : id,
    //   email: reqBody.email,
    //   username: reqBody.username,
    //   password: hashedPassword,
    // });

    

    // //console.log("User Registered");
    return NextResponse.json("User Registered");
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

}