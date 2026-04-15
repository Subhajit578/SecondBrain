import { CopyIcon } from "../icons/CopyIcon"
import { Button } from "./Button"

export function CopyButton({name} : {name:string}) {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(name)
    }
    return <div>
        <Button variant = "primary" loading={false} onClick={copyToClipboard} text = "Copy" fullWidth = {true} startIcon={<CopyIcon/>}/>
    </div>
}