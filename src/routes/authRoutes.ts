import { Router } from "express";
import {body} from 'express-validator'
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";

const router=Router()

router.post('/create-account',
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    body('password')
        .isLength({min:8}).withMessage('password es muy corto,minimo 8 caracteres'),
    body('password_confirmation').custom((value,{req})=>{
        if(value !== req.body.password){
            throw new Error('Los Password no son iguales')
        }
        return true 
    }),
    body('email')
        .isEmail().withMessage('E-mail no valido'),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account',
    body('token')
        .notEmpty().withMessage('El token no puede ir vacio'),
        handleInputErrors,
        AuthController.confirmAccount

)
router.post('/login',
    body('email')
    .isEmail().withMessage('E-mail no valido'),
    body('password')
    .isLength({min:8}).withMessage('password es muy corto,minimo 8 caracteres'),
    handleInputErrors,
    AuthController.login

)
router.post('/request-code',
    body('email')
    .isEmail().withMessage('E-mail no valido'),
    handleInputErrors,
    AuthController.requestConfimationCode

)


export default router;