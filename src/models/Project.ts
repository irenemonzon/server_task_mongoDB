import mongoose,{Schema,Document,PopulatedDoc, Types} from "mongoose";
import Task, { ITask } from "./Task";
import { IUser } from "./User";

//typescript

export interface IProject extends Document  {
    projectName:string
    clientName:string
    description:string
    tasks:PopulatedDoc<ITask & Document>[]
    manager:PopulatedDoc<IUser & Document>
    team:PopulatedDoc<IUser & Document>[]
}

//mongoose

const ProjectSchema:Schema= new Schema({
    projectName:{
        type:String,
        required:true,
        trim:true,
    },
    clientName:{
        type:String,
        required:true,
        trim:true   
    },
    description:{
        type:String,
        required:true,
        trim:true   
    },
    tasks:[
        {
            type:Types.ObjectId,
            ref:'Task'
        }
    ],
    manager:{
         type:Types.ObjectId,
         ref:'User'

    },
    team:[
        {
            type:Types.ObjectId,
            ref:'User'
        }
    ],

},{timestamps:true})

ProjectSchema.pre('deleteOne',{document:true},async function(){
    const projectId=this._id
    if(!projectId)return
    await Task.deleteMany({project:projectId})
})


const Project = mongoose.model<IProject>('Project',ProjectSchema)
export default Project