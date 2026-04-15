import { useRef } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import axios from "axios"
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
export function Signin() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const { login } = useAuth();
    const navigate = useNavigate()
    async function signin(){
        const username = usernameRef.current?.value.trim()
        const password = passwordRef.current?.value.trim()
        if(!username || ! password) {
            alert("Empty username and password")
            return;
        } 
        try {
            const res = await axios.post(`${BACKEND_URL}/app/v1/signin` , {username, password})
            const jwt = res.data.token
            localStorage.setItem("token", jwt)
            login(res.data.token);
            navigate("/dashboard")
        } catch {
            alert("Network Error")
        }
    }
    return <div className="h-screen w-screen flex bg-gray-200 justify-center items-center">
        <div className="bg-white rounded-xl border min-w-48 p-8">
        <Input placeholder="Username" ref = {usernameRef}/>
        <Input placeholder="Password" ref = {passwordRef}/>
        <div className="flex justify-center pt-4">
        <Button onClick={signin} variant = "primary" loading = {false} text= "Signin" fullWidth= {true}/>
        </div>
        </div>
    </div>
}