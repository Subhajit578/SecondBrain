import { useState } from "react"
/*
toggle-btn = 
bg
*/
export function ToggleButton({toggled, setToggled}: {toggled : boolean, setToggled : React.Dispatch<React.SetStateAction<boolean>>}) {
    return <div onClick ={() => {
        setToggled(!toggled)
    }} className={`flex w-20 h-10 bg-gray-600 rounded-full transition-all duration-500 ${toggled ? "bg-green-500" : "bg-gray-600"}`}>
        <span className={`h-10 w-10 bg-white rounded-full transition-all duration-500 shadow-lg ${toggled ? "ml-10": "" }`}>
        </span>
    </div>
}