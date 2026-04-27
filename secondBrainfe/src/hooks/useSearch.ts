// logic - 
// define 3 state variables one is results which updates the result one searching which sets
//  if we are searching or not and then active which is checking if we are in normal or search mode 

import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import type { Content } from "./useContent";

interface SearchResult extends Content{
    score : number;
}

export function useSearch() {
    const [results, setResults] = useState<SearchResult[]>([])
    const [active, setActive] = useState(false)
    const [searching, setSearching] = useState(false)
    // define two fucntions search and clear
    async function search(query: string) {
        if(!query.trim()) {
            clear();
            return;
        }
        setActive(true);
        setSearching(true);
        try {
            const res = await axios.get<SearchResult[]>(
                `${BACKEND_URL}/app/v1/search?q=${encodeURIComponent(query)}`, 
                    { headers : {token : localStorage.getItem("token") ?? ""} }
            )
            setResults(res.data);
        } catch(err) {
            console.log("Search Failed", err)
        } finally {
            setSearching(false)
        }
        } 
    function clear() {
        setResults([]);
        setActive(false);
    }
    return {results, searching, active, search, clear};
}