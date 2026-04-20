import { useRef, useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Input } from "./Input";
import { Button } from "./Button";
import axios from "axios";
import { BACKEND_URL } from "../config";

//controlled Component 
export function CreateContentModal({open, onClose}:{open : boolean, onClose :() => void }) {
    // interface CardProps {
    //     title: string
    //     link : string,
    //     type:'tweet' | 'youtube' | 'article' | 'document' ,
    //     icon: ReactElement, 
    //     date: string, 
    //     tag : string[]
    // }
    const titleRef = useRef<HTMLInputElement>(null)
    const linkRef = useRef<HTMLInputElement>(null)
    const [type, setType] = useState<string>()
    const [loading, setLoading] = useState(false)
    const tagRef = useRef<HTMLInputElement>(null)
    // //interface ButtonProps {
    // variant : "primary" | "secondary" , 
    // text : string,
    // onClick: () => void, 
    // loading : boolean,
    // fullWidth : boolean, 
    // startIcon? : ReactElement
    if (!open) return null;
    async function addContent() {
        if(loading) return;
        setLoading(true);
        if (!type) {
            alert("Please select a type: Youtube, Twitter, or Article.");
            return;
        }
        const title = titleRef.current?.value
        let link = linkRef.current?.value?.trim() || ""
        const UNSTags = tagRef.current?.value || "";
        const tags = UNSTags?.split(",").map(t=>t.trim()).filter(t => t.length >0)
        const date = new Date()
        if (link && !/^https?:\/\//i.test(link)) {
            link = `https://${link}`
        }
        const body: any = {title, tags, type, date}
        if (link) body.link = link
        try {
            await axios.post(`${BACKEND_URL}/app/v1/addContent`, body, {headers : {
                "token" : localStorage.getItem("token")
            }})
            onClose();
        } catch (err: any) {
            console.error("addContent failed:", err.response?.status, err.response?.data)
            alert(err.response?.data?.message ?? "Failed to add content. Check console.")
        }
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/55 backdrop-blur-[3px] transition-opacity"
                aria-hidden
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-content-title"
                className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/45 bg-linear-to-br from-blue-300 via-sky-200/95 to-indigo-200/90 p-6 shadow-[0_25px_60px_-15px_rgba(49,46,129,0.45)] ring-1 ring-indigo-300/30"
            >
                <div
                    className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-violet-400/25 blur-3xl"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute -bottom-12 -right-10 h-36 w-36 rounded-full bg-indigo-400/20 blur-3xl"
                    aria-hidden
                />
                <div
                    className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-indigo-500 via-violet-500 to-sky-400"
                    aria-hidden
                />

                <div className="relative mb-5 flex items-start gap-3 pt-1">
                    <div className="w-9 shrink-0" aria-hidden />
                    <div className="min-w-0 flex-1 text-center">
                        <h1
                            id="create-content-title"
                            className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-lg font-bold tracking-tight text-transparent drop-shadow-sm"
                        >
                            Add Content To Brain
                        </h1>
                    </div>
                    <button
                        type="button"
                        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/35 text-slate-800 shadow-sm ring-1 ring-white/50 transition hover:rotate-90 hover:bg-white/55"
                        onClick={onClose}
                    >
                        <CrossIcon />
                    </button>
                </div>

                <div className="relative flex flex-col gap-4">
                    <div className="w-full rounded-xl bg-white/35 p-1 shadow-inner ring-1 ring-white/50 backdrop-blur-[2px] [&_input]:m-0 [&_input]:w-full [&_input]:max-w-none [&_input]:border-indigo-200/60 [&_input]:shadow-sm">
                        <Input placeholder="Title for the content" ref = {titleRef}/>
                    </div>
                    <div className="w-full rounded-xl bg-white/35 p-1 shadow-inner ring-1 ring-white/50 backdrop-blur-[2px] [&_input]:m-0 [&_input]:w-full [&_input]:max-w-none [&_input]:border-indigo-200/60 [&_input]:shadow-sm">
                        <Input placeholder="Link for the content" ref = {linkRef}/>
                    </div>

                    <div className="rounded-2xl border border-white/40 bg-white/25 p-4 shadow-inner backdrop-blur-md">
                        <p className="mb-3 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                            <span className="h-px w-6 bg-linear-to-r from-transparent to-indigo-400/80" aria-hidden />
                            Content type
                            <span className="h-px w-6 bg-linear-to-l from-transparent to-indigo-400/80" aria-hidden />
                        </p>
                        <div className="flex flex-wrap justify-center gap-2.5">
                            <span
                                className={`rounded-lg transition-all duration-200 ${type === "youtube" ? "scale-105 shadow-md ring-2 ring-indigo-600 ring-offset-2 ring-offset-sky-200/90" : "hover:scale-[1.03]"}`}
                            >
                                <Button fullWidth = {false} loading = {false} text ="Youtube" variant="tag" onClick = {() => {
                                    setType("youtube")
                                }}>
                                </Button>
                            </span>
                            <span
                                className={`rounded-lg transition-all duration-200 ${type === "tweet" ? "scale-105 shadow-md ring-2 ring-indigo-600 ring-offset-2 ring-offset-sky-200/90" : "hover:scale-[1.03]"}`}
                            >
                                <Button fullWidth = {false} loading = {false} text ="Twitter" variant="tag" onClick = {() => {
                                    setType("tweet")
                                }}> 
                                </Button>
                            </span>
                            <span
                                className={`rounded-lg transition-all duration-200 ${type === "article" ? "scale-105 shadow-md ring-2 ring-indigo-600 ring-offset-2 ring-offset-sky-200/90" : "hover:scale-[1.03]"}`}
                            >
                                <Button fullWidth = {false} loading = {false} text ="Article" variant="tag" onClick = {() => {
                                    setType("article")
                                }}> 
                                </Button>
                            </span>
                        </div>
                    </div>

                    <div className="w-full rounded-xl bg-white/35 p-1 shadow-inner ring-1 ring-white/50 backdrop-blur-[2px] [&_input]:m-0 [&_input]:w-full [&_input]:max-w-none [&_input]:border-indigo-200/60 [&_input]:shadow-sm">
                        <Input placeholder="Tags for the content" ref = {tagRef}/>
                    </div>

                    <div className="flex justify-center pt-1">
                        <div className="rounded-xl bg-linear-to-r from-indigo-600/15 via-violet-500/15 to-indigo-600/15 p-[3px] shadow-lg shadow-indigo-900/15 ring-1 ring-white/40">
                            <div className="rounded-[10px] bg-transparent px-1 py-0.5">
                                <Button variant="primary" text="Add To Brain" onClick={addContent} loading={false} fullWidth={false}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
