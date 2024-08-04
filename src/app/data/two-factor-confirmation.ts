import { db, TwoFactorConfirmationTable } from "../../../db/schema";
import { eq } from "drizzle-orm";



export async function twoFactorConfirmationById(id:string){
    try {
        
        const twoFactorConfirmation = await db.select().from(TwoFactorConfirmationTable).where(eq(TwoFactorConfirmationTable.id,id)).limit(1);
        return twoFactorConfirmation;

    } catch (error) {
        return null;
    }
}