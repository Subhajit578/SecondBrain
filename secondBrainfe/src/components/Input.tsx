import { useState } from "react";

export function Input({placeholder, ref, type = "text"} : {placeholder:string, ref?: any, type?: string}) {
    const [visible, setVisible] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (visible ? "text" : "password") : type;

    return <div className="relative">
    <input placeholder={placeholder} ref={ref} type={inputType} className="px-4 py-2 border rounded m-2 bg-white w-full box-border pr-14"/>
    {isPassword && (
        <button type="button" onClick={() => setVisible(v => !v)} className="absolute right-5 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            {visible ? "Hide" : "Show"}
        </button>
    )}
    </div>
}
