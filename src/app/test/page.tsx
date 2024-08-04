"use client"
import React from 'react'
import {signOut, useSession } from 'next-auth/react'

const page = () => {
    const { data: session, status } = useSession();
    console.log(session);
    
    return (
        <div>
            {status === "authenticated"? (
                <>
                <h1>{JSON.stringify(session)}</h1>
                    <h1 className='text-white'>{session?.user?.email}</h1>

                    <h1 className='text-white'>{session?.user?.name}</h1>
                </>
            ):(<h1>No User Found in Session</h1>)}
        </div>
    )
}

export default page