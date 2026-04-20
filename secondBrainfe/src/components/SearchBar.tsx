import {useRef} from "react" 

export function SearchBar({
    onSearch, 
    onClear,
} : {
    onSearch : (query:string) => void;
    onClear : () =>void
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

    function handleChange() {
        const value = inputRef.current?.value?.trim() ?? "";
        if(timerRef.current) clearTimeout(timerRef.current);
        if(!value) {
            onClear();
            return;
        }
        timerRef.current = setTimeout(() => {
            onSearch(value);
        }, 500)
    }
    return(
<div className="flex items-center gap-2">
            <input
                ref={inputRef}
                type="text"
                placeholder="Search your brain..."
                onChange={handleChange}
                className="px-3 py-2 rounded-lg border border-slate-300 text-sm w-64 outline-none focus:border-blue-400"
            />
        </div>
    )
}