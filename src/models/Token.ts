import mongoose, { Document, Schema,Types } from "mongoose"

export interface IToken extends Document{
    token: string
    user:string
    createdAt:Date
   
}

const tokenSchema:Schema=new Schema({
    token:{
        type:String,
        required:true
    },
    user:{
        type:Types.ObjectId,
        ref:'User'
    },
    createAt:{
        type:Date,
        default:Date.now(),
        expires:"10m"
    }
    
})

const token=mongoose.model<IToken>('Token',tokenSchema)
export default token