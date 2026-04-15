import { useEffect, useState } from "react"
import axios from "axios"

export interface Content {
    id: string;
    title: string;
    link: string;
    type: "youtube" | "tweet" | "article";
    tags: string[];
    date: string;
}

export function useContent() : {contents:Content[],refresh:()=>void} {
    const [contents,setContents] = useState<Content[]>([])
    async function refresh() {
        await axios.get<Content[]>(`http://localhost:3000/app/v1/getContent?t=${Date.now()}`, {
            headers: {
                token: localStorage.getItem("token"),
            },
        }).then((response) => {
            console.log(response.data[0])
            setContents(response.data)
        })
    }
    useEffect(() => {
        refresh()
    },[])
    
    return {contents, refresh};
}