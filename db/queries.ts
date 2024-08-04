"use server";
import { db } from './schema';
import {userTable } from './schema';
import { asc, between, count, eq, getTableColumns, sql } from 'drizzle-orm';

// export async function createUser(data: any) {
//   console.log("Data from server: ", data);
  
//   const insertResult = await db.insert(userTable).values(data);
//   console.log("Insert Result: ", insertResult);
  
// }

// export async function validate(email: string, password){
//     return db.select().from(userTable).where(eq(userTable.email, email));
//   }

export const createUser = async (data: any) => {
  try {
    const insertResult = await db.insert(userTable).values(data);
    return insertResult;
  } catch (error) {
    return null;
  }
}


export async function getUserByEmail(email: string) {
    try {
      // Perform the query to fetch user by email
      const query = db.select().from(userTable).where(eq(userTable.email, email));
      const result = await query; // Await the query execution
  
      // Return the result directly or map to JSON if necessary
      return result; // Assuming `result` is already in the desired format
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error; // Handle or propagate the error as needed
    }
  }

export async function updatePost(id: string, data: any) {
    await db.update(userTable).set(data).where(eq(userTable.id, id));
  }
  