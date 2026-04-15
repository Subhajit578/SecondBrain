export function TextField({value} : {value: string}) {

    return <div>
    <input className = "px-4 py-2 border rounded w-full m-2 bg-white" value = {value} readOnly>
    </input>
    </div>
}