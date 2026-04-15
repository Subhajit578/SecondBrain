import { useRef } from "react"
import { Input } from "../components/Input"
import { Button } from "../components/Button"
import { useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config"
import axios from 'axios'
export function Signup() {
    const usernameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()
    async function signup() {
     let email = emailRef.current?.value.trim()
    
     let username = usernameRef.current?.value.trim()
     let password = passwordRef.current?.value.trim()
     if(!username || !password || !email) {
        alert("Enter the username Password Again")
     } 
     try{
     const success = await axios.post(`${BACKEND_URL}/app/v1/signup`, {email,username, password})
     if(success.status == 200 || success.status == 201) {
        navigate("/signin")
     } else {
        navigate("/signup")
     }
    } catch(err) {
        alert("Network error.")
    }
    }
    return <div className="h-screen w-screen flex justify-center items-center bg-gray-200">
        <div className="bg-white rounded-xl border min-w-48 p-8">
            <Input placeholder="email" ref = {emailRef}/>
            <Input placeholder="username" ref = {usernameRef}/>
            <Input placeholder="password" ref = {passwordRef}/>
            <div className="flex justify-center pt-4">
            <Button variant="primary" text = "Create A Account" onClick = {signup} loading = {false} fullWidth = {true}/>
            </div>
        </div>
    </div>
}