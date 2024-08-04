import NextAuth from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
// import NextAuth from "next-auth/next";
import LinkedInProvider, {LinkedInProfile} from "next-auth/providers/linkedin";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import  EmailProvider  from "next-auth/providers/email";
import { NextResponse } from "next/server";
import GitHubProvider from "next-auth/providers/github";
import { getUserByEmail } from "../db/queries";
import bcryptjs, { compare } from "bcryptjs";
import { db, TwoFactorConfirmationTable } from "../db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getUserById } from "./app/data/verification-token";
// import getTwoFActorConfi
import { twoFactorConfirmationById } from "./app/data/two-factor-confirmation";
import { eq } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
    session: {
      strategy: "jwt",
    },
    jwt: {
      secret: process.env.NEXTAUTH_SECRET,
    },

    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'CorTech Provider',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
              email: { label: "Email", type: "text", placeholder: "jsmith" },
              password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
              
                const {email, password} = credentials ?? {}

                if (!email || !password) {
                  console.log("Credentials not found");
                  return null
                }

                const user = await getUserByEmail(email);

                if(!user || !user[0].password) {
                  console.log("User not found");  }


                const passwordMatch = await bcryptjs.compare(
                  password,
                  user[0].password ?? "");

                  if(passwordMatch){
                    console.log("Login successful", user[0]);
                    return user[0];
                  }

                  if(!user[0]?.email_verified) return false;

                  


              // const res = await fetch("/api/login", {
              //   method: 'POST',
              //   body: JSON.stringify(credentials),
              //   headers: { "Content-Type": "application/json" }
              // })
              // const user = await res.json()
        
              // If no error and we have user data, return it
              // if (res.ok && user) {
              //   console.log("User found");
                
              //   return user
              // }
              // Return null if user data could not be retrieved
              // console.log("Not found");
              // return null

            }
          }),



      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      }),
      GitHubProvider({
        clientId: process.env.GITHUB_ID ?? "",
        clientSecret: process.env.GITHUB_SECRET ?? ""
      }),
      LinkedInProvider({
        clientId: process.env.LINKEDIN_CLIENT_ID || "",
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
        client: { token_endpoint_auth_method: "client_secret_post" },
        issuer: "https://www.linkedin.com",
        profile: (profile: LinkedInProfile) => ({
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }),
        wellKnown:
          "https://www.linkedin.com/oauth/.well-known/openid-configuration",
        authorization: {
          params: {
            scope: "openid profile email",
          },
        },
      }),

    ],

      callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "linkedin" || account?.provider === "github" || account?.provider === "credentials") {
        const { name, email, image } = user;

        const data = {
          username: name,
          email: email,
          image: image,
        };

        const existingUser = await getUserById(user.id)

        if(!existingUser) return false;

        if(!existingUser[0]?.email_verified)
        {
          return false;
        }

        if(existingUser[0]?.isTwoFactorEnabled)
        {
          const twoFactorConfirmation = await twoFactorConfirmationById(existingUser[0]?.id);

          if(!twoFactorConfirmation) return false;

          await db.delete(TwoFactorConfirmationTable).where(eq(TwoFactorConfirmationTable.id, twoFactorConfirmation[0]?.id));
        }

        
        
      }
      return true;
    },
  
    async jwt({token, user,profile}){
      console.log({token});
      token.role = "USER";
      return token;
      
    },

    async session({ session, token }) {
    console.log({sessionToken: token});
    // session?.user?.role = "USER";
    // session.user.role = "USER";
    return session; 
    
    },

  
  }



}