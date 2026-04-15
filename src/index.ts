import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {safeParse, uuidv4, z} from 'zod'
import cors from 'cors'
import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'
import {UserModel, ContentModel, LinkModel, TagModel} from './db'
import { isLoggedIn } from './middleware'
import "dotenv/config"
import {hash} from './util'
//@ts-ignore
const JWT_SECRET:string = process.env.JWT_SECRET
mongoose.connect(process.env.MONGODB_URI as string)
const app = express()
app.use(express.json())
app.use(cors())
type User = {
    _id: ObjectId,
    email : string,
    username : string,
    password : string
}
const idealUser =  z.object({
    email : z.string().email(),
    username : z.string().min(3).max(15),
    password : z.string().min(5).max(15).regex(/[@&_#]/,"Password Should contain a special character"). regex(/[a-z]/,"Password should contain one lowercase character"). regex(/[A-Z]/,"Password Should contain one Upper Case Charcter")
    .regex(/[0-9]/,"Password Should contain one number from 0-9")
})
const idealSigninUser = z.object({
    username : z.string().min(3).max(15),
    password : z.string().min(5).max(15).regex(/[@&_#]/,"Password Should contain a special character"). regex(/[a-z]/,"Password should contain one lowercase character"). regex(/[A-Z]/,"Password Should contain one Upper Case Charcter")
    .regex(/[0-9]/,"Password Should contain one number from 0-9")
})
const idealContent = z.object({
    type: z.enum(['document', 'tweet', 'youtube', 'link' , 'article']), 
    link: z.string().url().optional(), 
    title : z.string(),
    tags: z.array(z.string().min(1)).default([])
})
app.post("/app/v1/signup", async function(req, res) {
    const inputUser = req.body
    const parsedData = idealUser.safeParse(inputUser)
    if(!parsedData.success) {
        return res.status(411).send({message:"Invalid Input format"})
    } else {
        try {
            const hashedPassword = await bcrypt.hash(inputUser.password,10)
            await UserModel.create({
                username: inputUser.username,
                password: hashedPassword, 
                email : inputUser.email
            })
            return res.status(200).send({message: "User Created"})
        } catch {
            return res.status(403).send({message:"User Already Exists"})
        }
    }
})
app.post("/app/v1/signin", async function(req, res) {
    const UserInput  = req.body
    const parsedData = idealSigninUser.safeParse(UserInput)
    if(!parsedData.success){
        return res.status(411).send({message:"Invalid User Input Format"})
    } else {
        try {
            const user: User = await UserModel.findOne({username : UserInput.username})
            if(!user){
                return res.status(404).send({message:"User not found"})
            } else {
                try {
                const matchPassword = await bcrypt.compare(UserInput.password, user.password)
                if(matchPassword){
                    const token = jwt.sign({username:user.username,email:user.email,id: user._id},JWT_SECRET)
                    res.status(200).send({token : token})
                } else{
                    return res.status(411).send({message:"Invalid Password"})
                }
                } catch(err) {
                    res.send({Err: err})
                }
            }
        } catch( err){
            return res.send({message:err})
        }
    }
})
app.post("/app/v1/addContent", isLoggedIn, async function(req, res) {
    const userContent = req.body
    const parsedData = idealContent.safeParse(userContent)
    console.log((req as any).id , " in Add Content")
    if(!parsedData.success){
        console.log("ZOD FAILED:", parsedData.error.issues)
        res.status(411).send({message:"Invalid Input Format"})
    } else {
        try {
            const tagIds: ObjectId[] = []
            if(Array.isArray(userContent.tags)) {
                for (let t of userContent.tags ) {
                    const doc = await TagModel.findOneAndUpdate(
                        {tag: t.trim()},
                        {$setOnInsert : {tag: t.trim()}},
                        {new : true, upsert : true}
                    ).lean();
                    if(doc?._id){
                        tagIds.push(doc._id)
                    }
                }
            }
            console.log("Reached here")
            await ContentModel.create({
                link : userContent.link,
                userId : (req as any).id,
                type: userContent.type,
                title : userContent.title, 
                tags : tagIds,
                date: new Date()
            })
            return res.status(200).send({message:"Content added to the Brain"})
        } catch (err) {
            return res.send({Error : err})
        }
    }
}) 
app.get("/app/v1/getContent", isLoggedIn, async function(req,res){
    const userId = (req as any).id
    try {
        const data = await ContentModel.find({userId:userId}).populate({path:'tags', select : 'tag -_id'}).lean()
        //@ts-ignore
        const response = data.map(d => ({
            id:String(d._id), 
            title: d.title,
            link: d.link,
            type: d.type,
            tags: Array.isArray(d.tags) ? d.tags.map((t: any) => t.tag) : [],
            date: d.date ? new Date(d.date).toISOString() : new Date().toISOString()
        }))
        console.log(response)
        res.status(200).send(response)
    } catch(err) {
        return res.status(404).send({Error : err})
    }
})
app.get("/app/v1/getContentById/:id", isLoggedIn, async function(req,res){
    const contentId = req.params.id
    try {
        const data = await ContentModel.findById(contentId)
        return res.status(200).send(data)
    } catch(err) {
        console.error("Failed to get content by id:", err)
        return res.status(404).send({error:err})
    }
})
app.get("/app/v1/getContentByType", isLoggedIn, async function(req,res){
    const userId = (req as any).id
    const contentType = req.body.type
    try {
        const data = await ContentModel.find({type:contentType})
        return res.status(200).send(data)
    } catch(err) {
        return res.status(404).send({error:err})
    }
})
app.delete("/app/v1/deleteContent", isLoggedIn, async function(req,res){
    const userId = (req as any).id
    const contentId = String(req.body.contentId).trim()
    try {
        const deleted = await ContentModel.findByIdAndDelete({
            userId: userId, 
            _id: contentId
        })
        if(deleted){
        return res.status(200).send({message: "Content Deleted"})
        } else { 
            return res.status(200).send({message: "Content Does not exist"})
        }
    } catch (err){
        return res.status(404).send({err:err})
    }
})
app.post("/app/v1/brain/share", isLoggedIn, async function (req,res){
    const share = req.body.share
    const userId = (req as any).id
    if(share) {
        await LinkModel.create({
            userId:userId,
            hash : hash(20)
        })
    } else {
        await LinkModel.deleteMany({
            userId:userId
        })
    }
    return res.status(200).send({message:"Link Updated"})
})
app.get("/app/v1/brain/share/enabled", isLoggedIn, async(req, res) => {
    const userId = (req as any).id
    const exists = await LinkModel.exists({userId})
    res.status(200).send({share: !!exists})
})
app.get("/api/v1/brain/getLink", isLoggedIn, async function (req,res) {
    const userId = (req as any).id
    try {
        const hash = await LinkModel.findOne({userId: userId})
        if(hash) {
            const publicOrigin = (process.env.FRONTEND_PUBLIC_URL ?? "http://localhost:5173").replace(/\/$/, "")
            res.status(200).send({Link : `${publicOrigin}/brain/share/${hash.hash}`})
        } else {
            res.status(404). send({message : "Sharable Link not updated"})
        }
    } catch (err){
        res.status(404).send({error : err})
    }
})
app.get("/app/v1/brain/shareLink/:hash", async function (req,res){
    const hash = req.params.hash
    try{
        const link = await LinkModel.findOne({
            hash : hash
        })
        if(link){
            const data = await ContentModel.find({userId:link.userId})
            const user = await UserModel.findOne({
                _id : link.userId
            })
            res.status(200).send({username : user.username, content :data})
        } else {
            return res.status(404).send({message:"Error Finding Link"})
        }
    } catch(err) {
        res.status(404).send({err:err})
    }
})
const PORT = Number(process.env.PORT) || 3000
app.listen(PORT)