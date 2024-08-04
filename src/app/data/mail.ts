import { Resend } from "resend";


const resend = new Resend(process.env.RESEND_API_KEY);


export const sendTwoFactorEmail = async(email:string, token:string) => {

    await resend.emails.send({
        from:"enboarding@resend.dev",
        to: email,
        subject: "Two Factor Confirmation",
        html: `<p>Your 2FA code is: ${token}</p>`
    })
}

export const sendResetPasswordEmail = async(email: string, token: string) => {
    const resetLink = `http://localhost:3000/new-password?token=${token}`

    await resend.emails.send({
        from: "enboarding@resend.dev",
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
    })

}


export const sendVerificationEmail = async(email:string, token:string)=>{

    const confirmationLink = `http://localhost:3000/new-verification?token=${token}`

    await resend.emails.send({
        from: "enboarding@resend.dev",
        to: email,
        subject: "Confirm your email",
        html: `<p>Click <a href="${confirmationLink}">here</a> to confirm your email.</p>`
    })



}