import { integer,text, pgEnum, pgTable, serial, uniqueIndex, varchar, uuid, boolean } from 'drizzle-orm/pg-core';
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";



export const db = drizzle(sql);

// export const user_role = pgEnum('user_roles', ['USER','ADMIN']);


export const userTable = pgTable('cortech_auth', {
  id: text('id').primaryKey(),
  email: text("email").unique(),
  email_verified: text("email_verified"),
  username: text('username'),
  password: text('password'),
  // role: user_role('role').default('USER'),
  role: text('role').default('USER'),
  isTwoFactorEnabled: boolean("istwofactorenabled").default(false),
});

export const AccountTable = pgTable('cortech_account', {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text('user_id').references(() => userTable.id, {onDelete:"cascade"}),
  type: text('type'),
  provider: text('provider').unique(),
  providerAccountId: text('provider_account_id').unique(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
})


export const verificationTable = pgTable('cortech_verification', {
  id: text("id").primaryKey(),
  email: text('email').unique(),
  token: text('token').unique(),
  expires: text('expires'),

})

export const passwordResetTable = pgTable('cortech_password_reset', {
  id: text("id").primaryKey(),
  email: text('email').unique(),
  token: text('token').unique(),
  expires: text('expires'),
})

export const twoFactorTable = pgTable('cortech_two_factor', {
  id: text("id").primaryKey(),
  email: text('email').unique(),
  token: text('token').unique(),
  expires: text('expires'),
})

export const TwoFactorConfirmationTable = pgTable("two_factor_confirmation",{
  id: text("id").primaryKey(),
  userId: text("user_id").unique().references(()=> userTable.id, {onDelete: "cascade"}), 
})