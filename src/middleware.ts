import {Request,Response,NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import "dotenv/config"
//@ts-ignore
const JWT_SECRET:string = process.env.JWT_SECRET

export function isLoggedIn(req:Request,res:Response,next:NextFunction){
    const raw = req.headers["token"]
    const token = Array.isArray(raw) ? raw[0] : raw
    console.log(token)
    if(!token){
        return res.status(401).json({ message: 'Login to continue' })
    }
    try {
        const decodedToken = jwt.verify(token,JWT_SECRET) as any;
        console.log(decodedToken.id);
        (req as any).id = decodedToken.id
        next()
    }catch (err){
        res.status(401).send({message:"Error with the token"})
    }
}