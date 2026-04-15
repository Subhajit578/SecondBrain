import type { ReactElement } from "react"

interface ButtonProps {
    variant : "primary" | "secondary" | "tag", 
    text : string,
    onClick: () => void, 
    loading : boolean,
    fullWidth : boolean, 
    startIcon? : ReactElement
}
const variantClasses = {
    "primary" : "bg-indigo-600 text-white", 
    "secondary" : "bg-indigo-100 text-violet-500 font-medium" ,
    "tag" : " bg-purple-100 text-purple-600 hover:bg-purple-600 py-2 font-sans text-xs"
}
const defaultStyle = "px-2 py-2 rounded-md font-light flex items-center justify-center"
export function Button({variant, text, onClick, loading, fullWidth, startIcon} : ButtonProps) {
    return <button type="button" onClick = {onClick} className={variantClasses[variant] + " "+ defaultStyle + `${fullWidth ? " w-full flex justify-center items-center ":""} ${loading? "opacity-45 cursor-not-allowed" : ""}`}>
        <div className="pr-2">
            {startIcon}
        </div>
        {text}
    </button>
}