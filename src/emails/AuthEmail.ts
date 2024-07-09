import { transporter } from "../config/nodemailer"

interface IEmail{
    email:string
    name:string
    token:string
}

export class AuthEmail{
    static sendConfirmationEmail=async(user:IEmail)=>{
        await transporter.sendMail({
            from:'UpTask <admin@uptask.com>',
            to:user.email,
            subject:'Uptask - Confirma tu cuenta',
            text:'Uptask - Confirma tu cuenta',
            html:`<p>Hola: ${user.name}, has creado tu  cuenta solo debes confirmar tu cuenta</p>
            <p>Visita el siguiente enlace:</p>
            <a href=""> Confirma cuenta</a>
            <p>Ingresa el codigo<b>${user.token}</b></p>
            <p>Este token expira en 10 min</p>
            
            `
        })

    }
}