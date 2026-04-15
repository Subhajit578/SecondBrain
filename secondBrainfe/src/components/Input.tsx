export function Input({placeholder, ref} : {placeholder:string, ref?: any}) {
    return <div>
    <input placeholder={placeholder} ref ={ref} className = "px-4 py-2 border rounded m-2 bg-white">
    </input>
    </div>
}