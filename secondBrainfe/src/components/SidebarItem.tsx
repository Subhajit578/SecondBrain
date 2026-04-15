import type { ReactElement } from "react";

export function SidebarItem({text, icon,onClick} : {text : string, icon: ReactElement,onClick:()=> void}) {
    return <div onClick={onClick} className="text-gray-600 py-4 font-medium font-sans flex items-center cursor-pointer hover:bg-gray-200">
        <div className="pr-2 text-black">
            {icon}
        </div>
        {text}
    </div>
}