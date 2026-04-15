/*
toggle-btn = 
bg
*/
export function ToggleButton({toggled, setToggled}: {toggled : boolean, setToggled : React.Dispatch<React.SetStateAction<boolean>>}) {
    return <div onClick ={() => {
        setToggled(!toggled)
    }} className={`flex w-20 h-10 rounded-full transition-all duration-500 ${toggled ? "bg-linear-to-r from-indigo-600 to-violet-600 shadow-inner shadow-indigo-900/30" : "bg-slate-500/75"}`}>
        <span className={`h-10 w-10 bg-white rounded-full transition-all duration-500 shadow-lg ring-1 ring-white/60 ${toggled ? "ml-10": "" }`}>
        </span>
    </div>
}