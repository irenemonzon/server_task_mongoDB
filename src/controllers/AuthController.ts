import { Request,Response } from "express";

import User from "../models/User";
import { checkPassword, hasPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";

export class AuthController{

    static createAccount = async(req:Request,res:Response)=>{
        try{
            const {password,email}=req.body

            const userExist=await User.findOne({email})

            if(userExist){
                const error= new Error('El usuario ya esta registrado')
                return res.status(409).json({error:error.message})

            }

            const user=new User(req.body)

            user.password=await hasPassword(password)

            //generar token
            const token= new Token()
            token.token=generateToken()
            token.user=user.id

            //enviar email
            AuthEmail.sendConfirmationEmail({
                email:user.email,
                name:user.name,
                token:token.token
            })
          
            await Promise.allSettled([ user.save(),token.save()])
            res.send('cuenta creada,revisa tu email para confirmarla')
            
        }catch(error){
            res.status(500).json({error:'Hubo un error'})
        }
    }
    static confirmAccount = async(req:Request,res:Response)=>{
        try{

            const {token}=req.body

            const tokenExist= await Token.findOne({token})
            if(!tokenExist){
                const error=new Error('Token no valido')
                return res.status(404).json({error:error.message})
            }
            const user=await User.findById(tokenExist.user)

            user.confirmed=true
            await Promise.allSettled([user.save(),tokenExist.deleteOne()])
            res.send('Cuenta confirmada correctamente')

        }catch(error){
            res.status(500).json({error:'Hubo un error'})
        }

    }

 static login = async(req:Request,res:Response)=>{
        try{
            const {email,password}=req.body
            const user=await User.findOne({email})
            if(!user){
                const error=new Error('Usuario no encontrado')
                return res.status(404).json({error:error.message})
            }
            if(!user.confirmed){
                const token=new Token()
                token.user=user.id
                token.token=generateToken()
                await token.save()

                AuthEmail.sendConfirmationEmail({
                    email:user.email,
                    name:user.name,
                    token:token.token
                })
              
                const error=new Error('La cuenta no a sido confirmada,hemos enviado un email de confirmacion ')
                return res.status(401).json({error:error.message})
            }

            //revisar password

            const isPasswordCorrect=await checkPassword(password,user.password)
            if(!isPasswordCorrect){
                const error=new Error('Password incorrecto ')
                return res.status(401).json({error:error.message})
            }
            res.send('Autenticado')
            
        }catch(error){
            res.status(500).json({error:'Hubo un error'})
        }
    }


    static requestConfimationCode = async(req:Request,res:Response)=>{
        try{
            const {email}=req.body

            const user=await User.findOne({email})

            if(!user){
                const error= new Error('El usuario no esta registrado')
                return res.status(404).json({error:error.message})
            }
            if(user.confirmed){
                const error= new Error('El usuario ya tiene cuenta confirmada')
                return res.status(409).json({error:error.message})

            }

            //generar token
            const token= new Token()
            token.token=generateToken()
            token.user=user.id

            //enviar email
            AuthEmail.sendConfirmationEmail({
                email:user.email,
                name:user.name,
                token:token.token
            })
          
            await Promise.allSettled([ user.save(),token.save()])
            res.send('se envio un nuevo token a tu email')
            
        }catch(error){
            res.status(500).json({error:'Hubo un error'})
        }
    }
    static forgotPassword = async(req:Request,res:Response)=>{
        try{
            const {email}=req.body

            const user=await User.findOne({email})

            if(!user){
                const error= new Error('El usuario no esta registrado')
                return res.status(404).json({error:error.message})
            }
        
            //generar token
            const token= new Token()
            token.token=generateToken()
            token.user=user.id
            await token.save()

            //enviar email
            AuthEmail.sendPasswordResetToken({
                email:user.email,
                name:user.name,
                token:token.token
            })
          
            res.send('Revisa tu email para reestablecer password')
            
        }catch(error){
            res.status(500).json({error:'Hubo un error'})
        }
    }
}