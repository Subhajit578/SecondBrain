import type { ReactElement } from "react";
import { useEffect, useRef } from "react";
import { ShareIcon } from "../icons/ShareIcon";
import { Tag } from "./Tag";
import { DeleteIcon } from "../icons/DeleteIcon";
import axios from "axios";
import { BACKEND_URL } from "../config";

/** X/mobile URLs for the same tweet — widgets.js expects twitter.com status URLs. */
function normalizeTweetUrl(link: string): string {
    if (!link?.trim()) return link;
    try {
        const u = new URL(link.trim());
        const h = u.hostname.replace(/^www\./, "");
        if (h === "x.com") u.hostname = "twitter.com";
        else if (h === "mobile.twitter.com") u.hostname = "twitter.com";
        return u.toString();
    } catch {
        return link.replace(/https?:\/\/(www\.)?x\.com\//gi, "https://twitter.com/");
    }
}

declare global {
    interface Window {
        twttr?: {
            ready: (cb: (twttr: { widgets: { load: (el?: Element | null) => void } }) => void) => void;
        };
    }
}

function TweetEmbed({ link }: { link: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const tweetUrl = normalizeTweetUrl(link);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || !tweetUrl) return;

        const load = () => {
            window.twttr?.ready?.((twttr) => {
                twttr.widgets.load(container);
            });
        };

        if (window.twttr?.ready) {
            load();
            return;
        }
        let attempts = 0;
        const max = 80;
        const id = window.setInterval(() => {
            attempts += 1;
            if (window.twttr?.ready) {
                window.clearInterval(id);
                load();
            } else if (attempts >= max) {
                window.clearInterval(id);
            }
        }, 50);
        return () => window.clearInterval(id);
    }, [tweetUrl]);

    return (
        <div ref={containerRef} className="w-full min-w-0">
            <blockquote className="twitter-tweet" data-dnt="true">
                <a href={tweetUrl} />
            </blockquote>
        </div>
    );
}
interface CardProps {
    id: string,
    title: string,
    link : string,
    type:'tweet' | 'youtube' | 'article' | 'document' ,
    icon: ReactElement, 
    date: string, 
    tag : string[],
    onDelete?: () => void;
}
export function Card({id,title, link, type, icon, date, tag, onDelete} : CardProps) {

    async function deleteContent(id:string) {
        await axios.delete(`${BACKEND_URL}/app/v1/deleteContent`,{
            data: { contentId: id },
            headers: { token: localStorage.getItem("token") ?? "" }
          });
          onDelete?.();
    }
    async function getLink(id:string): Promise<string | null> {
        try {
        const res = await axios.get(`${BACKEND_URL}/app/v1/getContentById/${id}`,{
            data: {contentId: id}, 
            headers: { token: localStorage.getItem("token") ?? "" }})
            return res.data?.link ?? null
    } catch(err) {
        console.error("Failed to get link:", err)
        return null;
    }
}

    async function handleCopy(id:any) {
        const link = await getLink(id)
        if(link) {
            navigator.clipboard.writeText(link)
            alert("Link copied to clipboard")
        } else {
            alert("Failed to get link")
        }
    }
    return <div>
        <div className={`p-8 bg-white rounded-xl border w-96 border-gray-200 ${type === "tweet" ? "overflow-x-hidden overflow-y-visible" : "overflow-hidden"}`}> 
            <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center font-sans font-semibold text-xl">
                    {icon}
                    {title}
                </div>
                <div className="flex gap-3">
                    <div onClick={() => handleCopy(id)} className="cursor-pointer">
                    <ShareIcon />
                    </div>
                    <div onClick={() => deleteContent(id)} className="cursor-pointer">
                    <DeleteIcon />
                    </div>
                </div>
                </div>
                <div className={`mt-4 rounded-lg ${type === "youtube" ? "overflow-hidden" : "overflow-visible"}`}>
                {/* Youtube Video*/} 
                {type === "youtube" && <div><a href= {link} target="_blank"></a>
                <div className="aspect-auto">
                <iframe className="w-full" src={link.replace("watch", "embed").replace("?v=","/")} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                </div> </div>}
                {/* Article*/}
                {type === "article" && <a href={link} target="_blank" rel="noopener noreferrer">
                <div className="border rounded-xl p-4 hover:shadow-md transition cursor-pointer">
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-sm text-gray-500 truncate">{link}</p>
                </div>
                </a>}
                {/* Tweet — widgets.js only scans on first paint; SPA content must call twttr.widgets.load() */}
                {type === "tweet" && link && <TweetEmbed key={link} link={link} />}
                </div> 
                <div className="mt-2">       
                <Tag tags = {tag}/>
                </div> 
                <div className="mt-3 font-extralight text-base font-sans">
                    Added on {date}
                </div>
        </div>
    </div>
}