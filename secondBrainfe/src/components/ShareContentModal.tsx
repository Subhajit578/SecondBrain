import { useState, useEffect } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { ToggleButton } from "./ToggleButton";
import axios from "axios";
import { TextField } from "./TextField";
import { CopyButton } from "./CopyButton";
export function ShareContentModal({open, onClose} : {open:boolean, onClose:() => void}) {
    const [toggled, setToggled] = useState(false)
    const [link,setLink] = useState("")
    useEffect(() => {
    axios.get("http://localhost:3000/app/v1/brain/share/enabled", {headers : {token : localStorage.getItem("token")}}).then((res) => {
        setToggled(res.data.share)
    })
    },[open])

    if (!open) return null; 
    async function handleToggled() {
        const next = !toggled;
        try {
            await axios.post(
              "http://localhost:3000/app/v1/brain/share",
              { share: next },
              { headers: { token: localStorage.getItem("token") } }
            );

            setToggled(next);
            if (next) {
              const res = await axios.get("http://localhost:3000/api/v1/brain/getLink", {
                headers: { token: localStorage.getItem("token") },
              });
              setLink(res.data.Link);
            } else {
              setLink("");
            }
          } catch (err) {
            console.error("Failed to toggle share:", err);
          }
    }
    return <div className="fixed inset-0 flex justify-center items-center">
         <div className="h-screen w-screen fixed bg-slate-800 opacity-50 top-0 left-0 flex justify-center"> </div>
            <div className="flex flex-col items-center justify-center">
                <span className="h-98 w-100 relative z-10 bg-blue-300 p-4 rounded-2xl justify-center items-center"> 
                <div className="relative flex items-center justify-between w-full">
                    <h1 className="absolute translate-x text-lg font-semibold">
                        Share Your Brain
                    </h1>
                    <div className="ml-auto cursor-pointer" onClick= {onClose}>
                        <CrossIcon />
                    </div>
                </div>
                <br>
                </br>
                <br>
                </br>
                <div className="flex flex-col gap-4">
                <div className="relative px-2 flex items-center justify-between w-full">
                    <h1 className="absolute translate-x text-lg font-semibold">
                        Make your Brain Public
                    </h1>
                 <div className="ml-auto cursor-pointer">
                    <ToggleButton toggled = {toggled} setToggled={handleToggled}/>
                    </div>   
                </div>
                {toggled && <div className="items-center justify-center">
                <div className="mr-8">
                    <TextField value ={link} />
                </div>
                <CopyButton name ={link}/>
                </div>}
                </div>
                </span>
            </div>
    </div>
}