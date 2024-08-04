import { db, userTable } from "../../../db/schema";
import { verificationTable, passwordResetTable, twoFactorTable } from "../../../db/schema";
import { eq } from "drizzle-orm";


export const getTwoFactorTokenByToken = async(token:string) => {
    try {
        const twoFactorToken = await db.select().from(twoFactorTable).where(eq(twoFactorTable.token,token)).limit(1);
        return twoFactorToken;
    } catch (error) {
        return null;
    }
}

export const getTwoFactorTokenByEmail = async(email:string) => {
    try {
        const twoFactorEmail = await db.select().from(twoFactorTable).where(eq(twoFactorTable.email,email)).limit(1);
        return twoFactorEmail;
    } catch (error) {
        return null;
    }
}


export const getUserById = async (id:string) =>
{
    try {
        const user = db.select().from(userTable).where(eq(userTable.id, id)).limit(1);
        return user;
    } catch (error) {
        return null;
    }
}


export const getResetTokenByEmail = async(
    email:string
)=>{

    try {
        const resetToken = db.select().from(passwordResetTable).where(eq(passwordResetTable.email, email)).limit(1);
        return resetToken;

    } catch (error) {
        return null;
    }

}


export const getResetTokenByToken = async(token:string) => {
    try {
        const resetToken = db.select().from(passwordResetTable).where(eq(passwordResetTable.token, token)).limit(1);
        return resetToken;
    } catch (error) {
        return null;
    }
}

export const getVerificationTokenByEmail = async (
    email:string
) => {

    try {
        const verificationToken = await db.select().from(verificationTable).where(eq(verificationTable.email, email)).limit(1);
        return verificationToken;
    } catch (error) {
        return null;
    }


}

export const getVerificationTokenByToken = async (
    token:string
) => {

    try {
        const verificationToken = await db.select().from(verificationTable).where(eq(verificationTable.token, token)).limit(1);
        console.log("Verification Token: ", verificationToken);
        
        return verificationToken[0];
    } catch (error) {
        return null;
    }


}