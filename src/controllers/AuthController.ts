import { Request,Response } from "express";

import User from "../models/User";
import { checkPassword, hasPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

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
            const token= generateJWT({id:user.id})
            res.send(token)
            
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
    static ValidateToken = async(req:Request,res:Response)=>{
        try{

            const {token}=req.body

            const tokenExist= await Token.findOne({token})
            if(!tokenExist){
                const error=new Error('Token no valido')
                return res.status(404).json({error:error.message})
            }
            
            res.send('Token valido, Define tu nuevo password')

        }catch(error){
            res.status(500).json({error:'Hubo un error'})
        }

    }
    static updatePasswordWithToken = async(req:Request,res:Response)=>{
        try{

            const {token}=req.params

            const tokenExist= await Token.findOne({token})
            if(!tokenExist){
                const error=new Error('Token no valido')
                return res.status(404).json({error:error.message})
            }

            const user=await User.findById(tokenExist.user)
            user.password =await hasPassword(req.body.password)

            await Promise.allSettled([user.save(),tokenExist.deleteOne()])
            
            res.send('El password se modifico correctamente')

        }catch(error){
            res.status(500).json({error:'Hubo un error'})
        }

    }
    static user = async(req:Request,res:Response)=>{
       return res.json(req.user)
    }

    static updateProfile= async(req:Request,res:Response)=>{
        const {name,email}=req.body

        const userExists=await User.findOne({email})
        if(userExists && userExists.id.toString()!== req.user.id.toString()){
            const error = new Error('Ese email ya esta registrado')
            return res.status(409).json({error:error.message})
        }

        req.user.name=name
        req.user.email=email
        try{
            await req.user.save()
            res.send('Perfil actualizado correctamente')

        }catch(error){
            res.status(500).send('Hubo un error')
        }
       
     }

     static updateCurrentUserPassword= async(req:Request,res:Response)=>{

        const {current_password,password}=req.body

        const user= await User.findById(req.user.id)
        const isPasswordCorrect=await checkPassword(current_password,user.password)
        if(!isPasswordCorrect){
            const error = new Error('El password actual es incorrecto')
            return res.status(401).json({error:error.message})
        }

        try{
            user.password=await hasPassword(password)
            await user.save()
            res.send('El password se modifico correctamente')

        }catch(error){
            res.status(500).send('Hubo un error')

        }

     }


}