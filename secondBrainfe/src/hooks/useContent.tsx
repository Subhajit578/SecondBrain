import { useEffect, useState } from "react"
import axios from "axios"
import { BACKEND_URL } from "../config"

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
        await axios.get<Content[]>(`${BACKEND_URL}/app/v1/getContent?t=${Date.now()}`, {
            headers: {
                token: localStorage.getItem("token"),
            },
        }).then((response) => {
            setContents(response.data)
        })
    }
    useEffect(() => {
        refresh()
    },[])
    
    return {contents, refresh};
}